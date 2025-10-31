import React, { useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import classNames from 'classnames/bind';
import styles from './ManageRoutine.module.scss';
import {
  getAllRoutines,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  getRoutineById,
} from '../../../apis/routineApi';
import {
  getRoutineStepsByRoutineId,
  createRoutineStep,
  updateRoutineStep,
  deleteRoutineStep,
} from '../../../apis/routineStepApi';
import RoutineList from './components/RoutineList';
import RoutineForm from './components/RoutineForm';
import StepList from './components/StepList';
import StepForm from './components/StepForm';

const cx = classNames.bind(styles);

// Helpers
const initialRoutineForm = {
  userId: '',
  analysisId: '',
  description: '',
  parentRoutineId: '',
  status: 'active',
};

const initialStepForm = {
  stepOrder: 1,
  instruction: '',
  timeOfDay: 'morning',
  frequency: 'daily',
};

function ManageRoutine() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Routines
  const [routines, setRoutines] = useState([]);
  const [selectedRoutineId, setSelectedRoutineId] = useState('');
  const [routineForm, setRoutineForm] = useState(initialRoutineForm);
  const [editingRoutineId, setEditingRoutineId] = useState('');

  // Steps
  const [steps, setSteps] = useState([]);
  const [stepForm, setStepForm] = useState(initialStepForm);
  const [editingStepId, setEditingStepId] = useState('');

  const selectedRoutine = useMemo(
    () => routines.find((r) => r.id === selectedRoutineId),
    [routines, selectedRoutineId]
  );

  // Helper to resolve userId from localStorage or token
  const resolveUserId = () => {
    // direct storage keys first
    const direct = localStorage.getItem('userId');
    if (direct) return direct;
    const tryParse = (key) => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return undefined;
        return JSON.parse(raw);
      } catch {
        return undefined;
      }
    };

    const candidates = [
      tryParse('auth'),
      tryParse('user'),
      tryParse('currentUser'),
      tryParse('profile'),
    ];
    for (const obj of candidates) {
      const id = obj?.userId || obj?.id || obj?.data?.userId || obj?.data?.id;
      if (id) return id;
    }

    // fallback: decode JWT
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return undefined;
      const payload = jwtDecode(token);
      return (
        payload?.userId ||
        payload?.sub ||
        payload?.nameid ||
        payload?.id ||
        payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
      );
    } catch {
      return undefined;
    }
  };

  // Prefill userId from storage/token
  useEffect(() => {
    const uid = resolveUserId();
    if (uid) setRoutineForm((prev) => ({ ...prev, userId: uid }));
  }, []);

  // Load routines
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getAllRoutines();
        setRoutines(Array.isArray(data) ? data : data?.items || []);
      } catch (e) {
        setError(e?.response?.data?.message || e.message || 'Lỗi tải routines');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Load steps when routine selected
  useEffect(() => {
    const loadSteps = async () => {
      if (!selectedRoutineId) {
        setSteps([]);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const data = await getRoutineStepsByRoutineId(selectedRoutineId);
        setSteps(Array.isArray(data) ? data : data?.items || []);
      } catch (e) {
        setError(e?.response?.data?.message || e.message || 'Lỗi tải steps');
      } finally {
        setLoading(false);
      }
    };
    loadSteps();
  }, [selectedRoutineId]);

  // Routine handlers
  const handleRoutineInput = (e) => {
    const { name, value } = e.target;
    setRoutineForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitCreateRoutine = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!routineForm.userId) {
        setLoading(false);
        setError('Không tìm thấy User ID từ token. Vui lòng đăng nhập lại.');
        return;
      }
      const payload = {
        userId: routineForm.userId || undefined,
        analysisId: routineForm.analysisId || null,
        description: routineForm.description || undefined,
        parentRoutineId: routineForm.parentRoutineId || null,
        status: routineForm.status || 'active',
      };
      const created = await createRoutine(payload);
      // Reload
      const data = await getAllRoutines();
      setRoutines(Array.isArray(data) ? data : data?.items || []);
      setRoutineForm(initialRoutineForm);
      // auto select created if id present
      if (created?.id) setSelectedRoutineId(created.id);
      alert('Tạo routine thành công');
    } catch (e2) {
      setError(e2?.response?.data?.message || e2.message || 'Lỗi tạo routine');
    } finally {
      setLoading(false);
    }
  };

  const startEditRoutine = async (routineId) => {
    setEditingRoutineId(routineId);
    try {
      const r = routines.find((x) => x.id === routineId) || (await getRoutineById(routineId));
      if (r) {
        setRoutineForm({
          userId: r.userId || '',
          analysisId: r.analysisId || '',
          description: r.description || '',
          parentRoutineId: r.parentRoutineId || '',
          status: r.status || 'active',
        });
      }
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Không thể load routine');
    }
  };

  const submitUpdateRoutine = async (e) => {
    e.preventDefault();
    if (!editingRoutineId) return;
    setLoading(true);
    setError('');
    try {
      const payload = {
        description: routineForm.description || undefined,
        status: routineForm.status || undefined,
      };
      await updateRoutine(editingRoutineId, payload);
      const data = await getAllRoutines();
      setRoutines(Array.isArray(data) ? data : data?.items || []);
      alert('Cập nhật routine thành công');
      setEditingRoutineId('');
      setRoutineForm(initialRoutineForm);
    } catch (e2) {
      setError(e2?.response?.data?.message || e2.message || 'Lỗi cập nhật routine');
    } finally {
      setLoading(false);
    }
  };

  const removeRoutine = async (routineId) => {
    if (!window.confirm('Xóa routine này?')) return;
    setLoading(true);
    setError('');
    try {
      await deleteRoutine(routineId);
      const data = await getAllRoutines();
      setRoutines(Array.isArray(data) ? data : data?.items || []);
      if (selectedRoutineId === routineId) {
        setSelectedRoutineId('');
        setSteps([]);
      }
      alert('Đã xóa routine');
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Lỗi xóa routine');
    } finally {
      setLoading(false);
    }
  };

  // Step handlers
  const handleStepInput = (e) => {
    const { name, value } = e.target;
    setStepForm((prev) => ({ ...prev, [name]: name === 'stepOrder' ? Number(value) : value }));
  };

  const submitCreateStep = async (e) => {
    e.preventDefault();
    if (!selectedRoutineId) return alert('Chọn một routine trước');
    setLoading(true);
    setError('');
    try {
      const payload = {
        routineId: selectedRoutineId,
        stepOrder: stepForm.stepOrder,
        instruction: stepForm.instruction || undefined,
        timeOfDay: stepForm.timeOfDay || undefined,
        frequency: stepForm.frequency || undefined,
      };
      await createRoutineStep(payload);
      const data = await getRoutineStepsByRoutineId(selectedRoutineId);
      setSteps(Array.isArray(data) ? data : data?.items || []);
      setStepForm(initialStepForm);
      alert('Đã thêm step');
    } catch (e2) {
      setError(e2?.response?.data?.message || e2.message || 'Lỗi tạo step');
    } finally {
      setLoading(false);
    }
  };

  const startEditStep = (step) => {
    setEditingStepId(step.id);
    setStepForm({
      stepOrder: step.stepOrder ?? 1,
      instruction: step.instruction || '',
      timeOfDay: step.timeOfDay || 'morning',
      frequency: step.frequency || 'daily',
    });
  };

  const submitUpdateStep = async (e) => {
    e.preventDefault();
    if (!editingStepId) return;
    setLoading(true);
    setError('');
    try {
      const payload = {
        stepOrder: stepForm.stepOrder,
        instruction: stepForm.instruction || undefined,
        timeOfDay: stepForm.timeOfDay || undefined,
        frequency: stepForm.frequency || undefined,
      };
      await updateRoutineStep(editingStepId, payload);
      const data = await getRoutineStepsByRoutineId(selectedRoutineId);
      setSteps(Array.isArray(data) ? data : data?.items || []);
      alert('Cập nhật step thành công');
      setEditingStepId('');
      setStepForm(initialStepForm);
    } catch (e2) {
      setError(e2?.response?.data?.message || e2.message || 'Lỗi cập nhật step');
    } finally {
      setLoading(false);
    }
  };

  const removeStep = async (stepId) => {
    if (!window.confirm('Xóa step này?')) return;
    setLoading(true);
    setError('');
    try {
      await deleteRoutineStep(stepId);
      const data = await getRoutineStepsByRoutineId(selectedRoutineId);
      setSteps(Array.isArray(data) ? data : data?.items || []);
      alert('Đã xóa step');
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Lỗi xóa step');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx('container')}>
      <div className={cx('header')}>
        <h2>Quản lý Routine</h2>
      </div>

      {error && <div className={cx('error')}>{error}</div>}
      {loading && <div className={cx('loading')}>Đang xử lý...</div>}

      <div className={cx('grid')}>
        <section className={cx('panel')}>
          <h3>Danh sách Routines</h3>
          <RoutineList
            routines={routines}
            selectedRoutineId={selectedRoutineId}
            onSelect={setSelectedRoutineId}
            onEdit={startEditRoutine}
            onDelete={removeRoutine}
          />

          <RoutineForm
            editingRoutineId={editingRoutineId}
            routineForm={routineForm}
            onChange={handleRoutineInput}
            onSubmitCreate={submitCreateRoutine}
            onSubmitUpdate={submitUpdateRoutine}
            onCancelEdit={() => {
              setEditingRoutineId('');
              setRoutineForm(initialRoutineForm);
            }}
          />
        </section>

        <section className={cx('panel')}>
          <h3>Steps của Routine</h3>
          {!selectedRoutine && <div>Chọn một routine để quản lý steps.</div>}
          {selectedRoutine && (
            <>
              <StepList steps={steps} onEdit={startEditStep} onDelete={removeStep} />

              <StepForm
                editingStepId={editingStepId}
                stepForm={stepForm}
                onChange={handleStepInput}
                onSubmitCreate={submitCreateStep}
                onSubmitUpdate={submitUpdateStep}
                onCancelEdit={() => {
                  setEditingStepId('');
                  setStepForm(initialStepForm);
                }}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default ManageRoutine;
