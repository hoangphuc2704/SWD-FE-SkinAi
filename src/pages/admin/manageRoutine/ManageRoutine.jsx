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
import { DOCUMENT_LIBRARY_EVENT, readDocumentLibrary } from '../../../utils/documentLibrary';

const cx = classNames.bind(styles);

// Helpers
const initialRoutineForm = {
  userId: '', // ẩn với admin, tự lấy từ token để gán owner cho template
  analysisId: '',
  description: '',
  parentRoutineId: '',
  targetSkinType: '',
  targetConditions: '', // cho phép csv "acne; acne scars" hoặc "acne,redness"
  routineType: 'template',
  status: 'draft',
};

const allowedStatuses = ['draft', 'published', 'archived'];
const normalizeStatus = (status) => {
  if (!status) return 'draft';
  const val = status.toString().trim().toLowerCase();
  if (allowedStatuses.includes(val)) return val;
  if (val === 'active' || val === 'completed') return 'published';
  if (val === 'inactive' || val === 'paused') return 'draft';
  return 'draft';
};

const normalizeRoutineList = (list) => {
  const arr = Array.isArray(list) ? list : list?.items || [];
  return arr.filter((item) => (item?.status || '').toLowerCase() !== 'archived');
};

const formatBytes = (bytes) => {
  if (!bytes || Number.isNaN(Number(bytes))) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = Number(bytes);
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

const formatDateTime = (value) => {
  if (!value) return '';
  try {
    const date = new Date(value);
    return date.toLocaleString();
  } catch {
    return value;
  }
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
  // Template mode: không lọc theo user, hiển thị tất cả routines (admin chỉ dùng template)

  // Routines
  const [routines, setRoutines] = useState([]);
  const [selectedRoutineId, setSelectedRoutineId] = useState('');
  const [routineForm, setRoutineForm] = useState(initialRoutineForm);
  const [editingRoutineId, setEditingRoutineId] = useState('');

  // Steps
  const [steps, setSteps] = useState([]);
  const [stepForm, setStepForm] = useState(initialStepForm);
  const [editingStepId, setEditingStepId] = useState('');
  const [documentLibrary, setDocumentLibrary] = useState(() => readDocumentLibrary());

  const selectedRoutine = useMemo(
    () => routines.find((r) => r.routineId === selectedRoutineId),
    [routines, selectedRoutineId]
  );

  // Basic UUID validator (8-4-4-4-12 hex)
  const isUUID = (v) =>
    typeof v === 'string' &&
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v);

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

  // Prefill userId từ token (để làm owner của template), ẩn khỏi UI
  useEffect(() => {
    const uid = resolveUserId();
    if (uid) setRoutineForm((prev) => ({ ...prev, userId: uid }));
  }, []);

  // Sync document library when uploads change elsewhere
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const sync = () => setDocumentLibrary(readDocumentLibrary());
    window.addEventListener(DOCUMENT_LIBRARY_EVENT, sync);
    return () => window.removeEventListener(DOCUMENT_LIBRARY_EVENT, sync);
  }, []);

  // Load routines
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getAllRoutines();
        const list = normalizeRoutineList(data);
        setRoutines(list);
        setSelectedRoutineId((prev) => prev || list[0]?.routineId || '');
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
      // Validate UUID format for userId if backend expects UUID
      if (!isUUID(routineForm.userId)) {
        setLoading(false);
        setError('User ID không hợp lệ (không đúng định dạng UUID). Vui lòng chọn/nhập lại.');
        return;
      }
      // Optional fields: if provided, must be UUID
      if (routineForm.analysisId && !isUUID(routineForm.analysisId)) {
        setLoading(false);
        setError('Analysis ID không hợp lệ (phải là UUID)');
        return;
      }
      if (routineForm.parentRoutineId && !isUUID(routineForm.parentRoutineId)) {
        setLoading(false);
        setError('Parent Routine ID không hợp lệ (phải là UUID)');
        return;
      }
      // Only include keys that have values to avoid sending nulls
      const payload = {
        userId: routineForm.userId,
        ...(routineForm.analysisId ? { analysisId: routineForm.analysisId } : {}),
        ...(routineForm.description ? { description: routineForm.description } : {}),
        ...(routineForm.parentRoutineId ? { parentRoutineId: routineForm.parentRoutineId } : {}),
        ...(routineForm.targetSkinType ? { targetSkinType: routineForm.targetSkinType } : {}),
        ...(routineForm.targetConditions ? { targetConditions: routineForm.targetConditions } : {}),
        routineType: 'template',
        status: normalizeStatus(routineForm.status),
      };
      const created = await createRoutine(payload);
      // Reload
      const data = await getAllRoutines();
      const list = normalizeRoutineList(data);
      setRoutines(list);
      setRoutineForm((prev) => ({ ...initialRoutineForm, userId: prev.userId }));
      // auto select created if id present
      if (created?.routineId) {
        setSelectedRoutineId(created.routineId);
      } else if (list.length) {
        setSelectedRoutineId(list[0].routineId);
      }
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
      const r =
        routines.find((x) => x.routineId === routineId) || (await getRoutineById(routineId));
      if (r) {
        setRoutineForm((prev) => ({
          userId: prev.userId || r.userId || '',
          analysisId: r.analysisId || '',
          description: r.description || '',
          parentRoutineId: r.parentRoutineId || '',
          targetSkinType: r.targetSkinType || '',
          targetConditions: r.targetConditions || '',
          routineType: r.routineType || 'template',
          status: normalizeStatus(r.status),
        }));
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
        targetSkinType: routineForm.targetSkinType || undefined,
        targetConditions: routineForm.targetConditions || undefined,
        routineType: routineForm.routineType || undefined,
        status: normalizeStatus(routineForm.status),
      };
      await updateRoutine(editingRoutineId, payload);
      const data = await getAllRoutines();
      const list = normalizeRoutineList(data);
      setRoutines(list);
      if (!list.find((item) => item.routineId === editingRoutineId)) {
        setSelectedRoutineId(list[0]?.routineId || '');
      }
      alert('Cập nhật routine thành công');
      setEditingRoutineId('');
      setRoutineForm((prev) => ({ ...initialRoutineForm, userId: prev.userId }));
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
      const refreshed = await getAllRoutines();
      const nextRoutines = normalizeRoutineList(refreshed);
      setRoutines(nextRoutines);
      if (selectedRoutineId === routineId) {
        const fallback = nextRoutines[0]?.routineId || '';
        setSelectedRoutineId(fallback);
        if (fallback) {
          try {
            const data = await getRoutineStepsByRoutineId(fallback);
            setSteps(Array.isArray(data) ? data : data?.items || []);
          } catch {
            setSteps([]);
          }
        } else {
          setSteps([]);
        }
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
    setEditingStepId(step.stepId);
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

  const refreshDocumentLibrary = () => {
    setDocumentLibrary(readDocumentLibrary());
  };

  const copyDocumentUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      console.error('Copy failed', err);
      alert('Không thể copy URL, vui lòng copy thủ công.');
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
              setRoutineForm((prev) => ({ ...initialRoutineForm, userId: prev.userId }));
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

              <div className={cx('docLibrary')}>
                <div className={cx('docLibraryHeader')}>
                  <h4>Tài liệu đã upload</h4>
                  <button
                    className={cx('btn', 'sm')}
                    type="button"
                    onClick={refreshDocumentLibrary}
                  >
                    Làm mới
                  </button>
                </div>
                {documentLibrary.length ? (
                  <div className={cx('docLibraryList')}>
                    {documentLibrary.map((doc) => (
                      <div key={doc.id} className={cx('docLibraryItem')}>
                        <div className={cx('itemTitle')}>
                          {doc.title || doc.originalFilename || doc.publicId}
                        </div>
                        <div className={cx('docLibraryMeta')}>
                          {doc.originalFilename && <span>{doc.originalFilename}</span>}
                          {doc.format && <span>{doc.format.toUpperCase()}</span>}
                          {doc.bytes && <span>{formatBytes(doc.bytes)}</span>}
                          {doc.uploadedAt && <span>{formatDateTime(doc.uploadedAt)}</span>}
                        </div>
                        {doc.note && <div className={cx('docLibraryNote')}>{doc.note}</div>}
                        <div className={cx('docLibraryActions')}>
                          <button
                            type="button"
                            className={cx('btn', 'sm')}
                            onClick={() => window.open(doc.url, '_blank')}
                          >
                            Xem
                          </button>
                          <button
                            type="button"
                            className={cx('btn', 'sm')}
                            onClick={() => copyDocumentUrl(doc.url)}
                          >
                            Copy URL
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={cx('docLibraryEmpty')}>
                    Chưa có tài liệu nào. Upload tại mục "Thư viện tài liệu" để dùng làm bước
                    routine.
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default ManageRoutine;
