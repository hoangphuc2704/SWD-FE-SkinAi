import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Routine.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProfile } from '../../../apis/userApi';
import { getRoutineStepsByRoutineId } from '../../../apis/routineStepApi';
import { getRoutineInstancesByUserId } from '../../../apis/routineInstanceApi';
import { getRoutineById } from '../../../apis/routineApi';
import {
  createRoutineProgress,
  getRoutineProgressByInstanceId,
  updateRoutineProgress,
} from '../../../apis/routineProgressApi';
import { createFeedback } from '../../../apis/feedbackApi';
const cx = classNames.bind(styles);

const DEFAULT_PROGRESS_STATUS = 'pending';

const toDateKey = (value) => {
  if (!value) {
    return '';
  }
  if (typeof value === 'string') {
    return value.split('T')[0];
  }
  try {
    const iso = new Date(value).toISOString();
    return iso.split('T')[0];
  } catch {
    return '';
  }
};

const normalizeRoutineStep = (step, index) => {
  if (!step) return null;
  const stepId = step.stepId || step.StepId || step.id || step.Id || null;
  const timeOfDayRaw = step.timeOfDay || step.TimeOfDay || '';
  const frequencyRaw = step.frequency || step.Frequency || '';
  const orderCandidate = step.stepOrder ?? step.StepOrder;
  const normalizedOrder = Number.isFinite(orderCandidate)
    ? Number(orderCandidate)
    : Number.parseInt(orderCandidate, 10);

  return {
    stepId,
    instruction: step.instruction || step.Instruction || '',
    timeOfDay: timeOfDayRaw?.toString().trim().toLowerCase() || '',
    frequency: frequencyRaw?.toString().trim().toLowerCase() || '',
    rawTimeOfDay: timeOfDayRaw,
    rawFrequency: frequencyRaw,
    stepOrder: Number.isFinite(normalizedOrder) ? normalizedOrder : index + 1,
  };
};

const normalizeProgressEntry = (entry) => {
  if (!entry) return null;
  const progressId = entry.progressId || entry.ProgressId || entry.id || entry.Id;
  const stepId = entry.stepId || entry.StepId;
  if (!progressId || !stepId) return null;

  return {
    progressId,
    instanceId: entry.instanceId || entry.InstanceId,
    stepId,
    completedAt: entry.completedAt || entry.CompletedAt || null,
    photoUrl: entry.photoUrl || entry.PhotoUrl || '',
    note: entry.note ?? entry.Note ?? '',
    status: (entry.status || entry.Status || DEFAULT_PROGRESS_STATUS)
      .toString()
      .trim()
      .toLowerCase(),
    irritationLevel: entry.irritationLevel ?? entry.IrritationLevel ?? null,
    moodNote: entry.moodNote ?? entry.MoodNote ?? '',
  };
};

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Chưa làm', pill: 'status-pending' },
  { value: 'completed', label: 'Hoàn thành', pill: 'status-completed' },
  { value: 'skipped', label: 'Bỏ qua', pill: 'status-skipped' },
  { value: 'missed', label: 'Quên thực hiện', pill: 'status-missed' },
];

const getStatusOption = (status) =>
  STATUS_OPTIONS.find((option) => option.value === status) ||
  STATUS_OPTIONS.find((option) => option.value === DEFAULT_PROGRESS_STATUS) ||
  STATUS_OPTIONS[0];

function Routine() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [routineInstances, setRoutineInstances] = useState([]);
  const [routineDetails, setRoutineDetails] = useState({});
  const [selectedInstanceId, setSelectedInstanceId] = useState('');
  const [selectedRoutineId, setSelectedRoutineId] = useState('');
  const [steps, setSteps] = useState([]);
  const [headerTitle, setHeaderTitle] = useState('Quy Trình Chăm Sóc Da');
  const [progressEntries, setProgressEntries] = useState([]);
  const [progressLoading, setProgressLoading] = useState(false);
  const [progressDrafts, setProgressDrafts] = useState({});
  const [savingStepId, setSavingStepId] = useState('');
  const [flashMessage, setFlashMessage] = useState(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const [feedbackDraft, setFeedbackDraft] = useState({ rating: '5', comment: '', stepId: '' });
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const detailForSelected = routineDetails[selectedRoutineId];
  const routineSectionRef = useRef(null);
  const hasScrolledToRoutineRef = useRef(false);
  const locationState = location.state || {};
  const locationStateRoutineName = locationState.routineName;
  const locationStatePreferredRoutineId = locationState.routineId;
  const shouldScrollToRoutine = Boolean(
    locationState.scrollToRoutine || locationState.scrollTo === 'skincare'
  );

  const unwrapServiceResult = (payload) => {
    if (!payload) return null;
    if (typeof payload.success === 'boolean') {
      if (!payload.success) return null;
      return payload.data ?? null;
    }
    if (payload.data !== undefined) {
      return payload.data;
    }
    return payload;
  };

  const normalizeInstance = (item) => {
    if (!item) return null;
    return {
      instanceId: item.instanceId || item.InstanceId || item.id,
      routineId: item.routineId || item.RoutineId,
      startDate: item.startDate || item.StartDate || null,
      endDate: item.endDate || item.EndDate || null,
      status: item.status || item.Status || 'planned',
    };
  };

  // Fetch routines list unless a preferred routineId is provided
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const preferredRoutineId = location.state?.routineId;
        const preferredInstanceId = location.state?.instanceId;
        const preferredUserId = location.state?.userId;

        // Nếu có preferredId, ưu tiên hiển thị routine đó và KHÔNG gọi /me
        // Không có preferredUserId -> dùng userId từ localStorage nếu có, nếu không thì /me
        let uid = undefined;
        try {
          const stored = localStorage.getItem('user');
          if (stored) {
            const u = JSON.parse(stored);
            uid = u?.id || u?.userId || u?.UserId || uid;
          }
        } catch {
          // ignore JSON parse errors
        }

        if (!uid) {
          try {
            const profile = await getProfile();
            const profileData = profile?.data || profile;
            uid = profileData?.id || profileData?.Id || profileData?.userId || profileData?.UserId;
          } catch {
            uid = undefined;
          }
        }

        if (preferredUserId) {
          uid = preferredUserId;
        }

        setCurrentUserId(uid || '');

        if (uid) {
          try {
            const response = await getRoutineInstancesByUserId(uid);
            const data = unwrapServiceResult(response);
            const list = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
            const normalizedList = list
              .map(normalizeInstance)
              .filter((item) => item && item.routineId)
              .map((item) => item);
            setRoutineInstances(normalizedList);

            if (normalizedList.length > 0) {
              let target = null;
              if (preferredInstanceId) {
                target = normalizedList.find((i) => i.instanceId === preferredInstanceId);
              }
              if (!target && preferredRoutineId) {
                target = normalizedList.find((i) => i.routineId === preferredRoutineId);
              }
              if (!target) {
                target = [...normalizedList].sort((a, b) => {
                  const ta = new Date(a.startDate || 0).getTime();
                  const tb = new Date(b.startDate || 0).getTime();
                  return tb - ta;
                })[0];
              }

              if (target) {
                setSelectedInstanceId(target.instanceId);
                setSelectedRoutineId(target.routineId);
              }
            } else if (preferredRoutineId) {
              setSelectedRoutineId(preferredRoutineId);
            }
          } catch (err) {
            if (err?.response?.status === 404 || err?.response?.status === 400) {
              setRoutineInstances([]);
              setSelectedInstanceId('');
              setSelectedRoutineId(preferredRoutineId || '');
            } else if (err?.response?.status === 401) {
              navigate('/login');
              return;
            } else {
              console.warn('Routine instance list fetch failed:', err?.message || err);
            }
          }
        }
      } catch (e) {
        console.error('Error loading routines:', e);
        if (e?.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate, location.state?.routineId, location.state?.userId, location.state?.instanceId]);

  useEffect(() => {
    if (!flashMessage) {
      return;
    }
    const timer = setTimeout(() => setFlashMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [flashMessage]);

  useEffect(() => {
    if (
      selectedRoutineId === locationStatePreferredRoutineId &&
      !detailForSelected &&
      locationStateRoutineName
    ) {
      setHeaderTitle(locationStateRoutineName);
    }
  }, [
    detailForSelected,
    locationStateRoutineName,
    locationStatePreferredRoutineId,
    selectedRoutineId,
  ]);

  // Fetch steps when routine changes
  useEffect(() => {
    const fetchSteps = async () => {
      if (!selectedRoutineId) return;
      try {
        setLoading(true);
        if (
          !detailForSelected &&
          (selectedRoutineId !== locationStatePreferredRoutineId || !locationStateRoutineName)
        ) {
          setHeaderTitle('Quy Trình Chăm Sóc Da');
        }
        const res = await getRoutineStepsByRoutineId(selectedRoutineId);
        const normalizedSteps = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
        const preparedSteps = normalizedSteps
          .map((step, index) => normalizeRoutineStep(step, index))
          .filter((item) => item && item.stepId);
        setSteps(preparedSteps);

        // fetch routine detail for header/selector label (best effort)
        if (!detailForSelected) {
          try {
            const detailRes = await getRoutineById(selectedRoutineId);
            const detail = detailRes?.data || detailRes;
            if (detail) {
              setRoutineDetails((prev) => ({
                ...prev,
                [selectedRoutineId]: detail,
              }));
              if (detail?.name || detail?.Name) {
                setHeaderTitle(detail.name || detail.Name);
              }
            }
          } catch {
            // ignore detail fetch errors
          }
        } else {
          if (detailForSelected?.name || detailForSelected?.Name) {
            setHeaderTitle(detailForSelected.name || detailForSelected.Name);
          }
        }
      } catch (e) {
        console.error('Error loading steps:', e);
        setSteps([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSteps();
  }, [
    selectedRoutineId,
    detailForSelected,
    locationStateRoutineName,
    locationStatePreferredRoutineId,
  ]);

  useEffect(() => {
    if (!shouldScrollToRoutine || loading || hasScrolledToRoutineRef.current) {
      return;
    }
    hasScrolledToRoutineRef.current = true;
    const timer = setTimeout(() => {
      routineSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
    return () => clearTimeout(timer);
  }, [shouldScrollToRoutine, loading]);

  const refreshProgress = useCallback(async () => {
    if (!selectedInstanceId) {
      setProgressEntries([]);
      return;
    }
    setProgressLoading(true);
    try {
      const response = await getRoutineProgressByInstanceId(selectedInstanceId);
      const payload = response?.data ?? response;
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.items)
        ? payload.items
        : [];
      const normalized = list
        .map((item) => normalizeProgressEntry(item))
        .filter((entry) => entry && entry.stepId);
      setProgressEntries(normalized);
    } catch (error) {
      setProgressEntries([]);
      const message = error?.response?.data?.message || 'Không thể tải tiến trình routine.';
      setFlashMessage({ type: 'error', message });
    } finally {
      setProgressLoading(false);
    }
  }, [selectedInstanceId]);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  const todayKey = useMemo(() => new Date().toISOString().split('T')[0], []);

  const progressByStepToday = useMemo(() => {
    const map = {};
    (progressEntries || []).forEach((entry) => {
      if (!entry?.stepId) return;
      const dayKey = toDateKey(entry.completedAt);
      if (dayKey === todayKey) {
        map[entry.stepId] = entry;
      }
    });
    return map;
  }, [progressEntries, todayKey]);

  useEffect(() => {
    if (!steps || steps.length === 0) {
      setProgressDrafts({});
      return;
    }
    setProgressDrafts(() => {
      const next = {};
      steps.forEach((step) => {
        if (!step?.stepId) return;
        const current = progressByStepToday[step.stepId];
        next[step.stepId] = {
          status: current?.status || DEFAULT_PROGRESS_STATUS,
          note: current?.note ?? '',
          irritationLevel:
            current?.irritationLevel === null || current?.irritationLevel === undefined
              ? ''
              : String(current.irritationLevel),
          moodNote: current?.moodNote ?? '',
        };
      });
      return next;
    });
  }, [steps, progressByStepToday]);

  const weeklySteps = useMemo(
    () =>
      (steps || []).filter((s) => (s.frequency || '').toString().trim().toLowerCase() === 'weekly'),
    [steps]
  );
  const morningSteps = useMemo(
    () =>
      (steps || []).filter((s) => {
        const timeOfDay = (s.timeOfDay || '').toString().trim().toLowerCase();
        const frequency = (s.frequency || '').toString().trim().toLowerCase();
        return (timeOfDay === 'morning' || timeOfDay === 'both') && frequency !== 'weekly';
      }),
    [steps]
  );
  const eveningSteps = useMemo(
    () =>
      (steps || []).filter((s) => {
        const timeOfDay = (s.timeOfDay || '').toString().trim().toLowerCase();
        const frequency = (s.frequency || '').toString().trim().toLowerCase();
        return (timeOfDay === 'evening' || timeOfDay === 'both') && frequency !== 'weekly';
      }),
    [steps]
  );
  const otherSteps = useMemo(
    () =>
      (steps || []).filter((s) => {
        const frequency = (s.frequency || '').toString().trim().toLowerCase();
        if (frequency === 'weekly') {
          return false;
        }
        const timeOfDay = (s.timeOfDay || '').toString().trim().toLowerCase();
        return timeOfDay !== 'morning' && timeOfDay !== 'evening' && timeOfDay !== 'both';
      }),
    [steps]
  );

  const renderStepItem = (step, idx, variantClass) => {
    const key = step.stepId || `${variantClass}-${idx}`;
    const draft = progressDrafts[step.stepId] || {
      status: DEFAULT_PROGRESS_STATUS,
      note: '',
      irritationLevel: '',
      moodNote: '',
    };
    const currentStatus =
      progressByStepToday[step.stepId]?.status || draft.status || DEFAULT_PROGRESS_STATUS;
    const statusOption = getStatusOption(currentStatus);
    const isSaving = savingStepId === step.stepId;
    const isLoading = progressLoading && savingStepId !== step.stepId;
    const disableControls = isSaving || isLoading;

    return (
      <div key={key} className={cx('step-item')}>
        <div className={cx('step-number', variantClass)}>{step.stepOrder}</div>
        <div className={cx('step-content')}>
          <h3 className={cx('step-title')}>{step.instruction}</h3>
          <p className={cx('step-description')}>
            Tần suất:{' '}
            {step.frequency === 'daily'
              ? 'Hằng ngày'
              : step.rawFrequency || step.frequency || 'Không xác định'}
          </p>

          <div className={cx('progress-summary')}>
            <span>Trạng thái hôm nay:</span>
            <span className={cx('status-pill', statusOption.pill)}>{statusOption.label}</span>
            {progressByStepToday[step.stepId]?.completedAt && (
              <span className={cx('status-time')}>
                {new Date(progressByStepToday[step.stepId].completedAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            )}
          </div>

          <details className={cx('progress-details')}>
            <summary>Cập nhật tiến trình</summary>
            <div className={cx('progress-form')}>
              {isLoading && <div className={cx('progress-loading')}>Đang tải tiến trình...</div>}
              <label>Trạng thái</label>
              <select
                value={draft.status}
                onChange={(e) => handleDraftChange(step.stepId, 'status', e.target.value)}
                disabled={disableControls}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <label>Ghi chú</label>
              <textarea
                rows={2}
                value={draft.note}
                onChange={(e) => handleDraftChange(step.stepId, 'note', e.target.value)}
                placeholder="Ghi chú, cảm nhận sau khi chăm sóc"
                disabled={disableControls}
              />

              <div className={cx('progress-inline')}>
                <label htmlFor={`irritation-${key}`}>Độ kích ứng (1-5)</label>
                <input
                  id={`irritation-${key}`}
                  type="number"
                  min="1"
                  max="5"
                  value={draft.irritationLevel}
                  onChange={(e) =>
                    handleDraftChange(step.stepId, 'irritationLevel', e.target.value)
                  }
                  disabled={disableControls}
                />

                <label htmlFor={`mood-${key}`}>Tâm trạng</label>
                <input
                  id={`mood-${key}`}
                  type="text"
                  value={draft.moodNote}
                  onChange={(e) => handleDraftChange(step.stepId, 'moodNote', e.target.value)}
                  placeholder="Ví dụ: Da thoải mái hơn"
                  disabled={disableControls}
                />
              </div>

              <button
                type="button"
                className={cx('progress-save-btn')}
                onClick={() => handleSaveProgress(step.stepId)}
                disabled={disableControls}
              >
                {isSaving ? 'Đang lưu...' : isLoading ? 'Đang tải...' : 'Lưu tiến trình'}
              </button>
            </div>
          </details>
        </div>
      </div>
    );
  };

  const handleDraftChange = useCallback((stepId, field, value) => {
    if (!stepId) {
      return;
    }
    setProgressDrafts((prev) => {
      const current = prev[stepId] || {
        status: DEFAULT_PROGRESS_STATUS,
        note: '',
        irritationLevel: '',
        moodNote: '',
      };
      return {
        ...prev,
        [stepId]: {
          ...current,
          [field]: value,
        },
      };
    });
  }, []);

  const handleSaveProgress = useCallback(
    async (stepId) => {
      if (!stepId || !selectedInstanceId) {
        setFlashMessage({
          type: 'error',
          message: 'Vui lòng chọn lộ trình trước khi cập nhật bước.',
        });
        return;
      }

      const draft = progressDrafts[stepId] || {
        status: DEFAULT_PROGRESS_STATUS,
        note: '',
        irritationLevel: '',
        moodNote: '',
      };

      const irritationLevelValue = draft.irritationLevel;
      const irritationLevelNumber =
        irritationLevelValue === '' ? null : Number(irritationLevelValue);
      if (
        irritationLevelNumber !== null &&
        (Number.isNaN(irritationLevelNumber) ||
          irritationLevelNumber < 1 ||
          irritationLevelNumber > 5)
      ) {
        setFlashMessage({ type: 'error', message: 'Độ kích ứng phải nằm trong khoảng 1 đến 5.' });
        return;
      }

      const updatePayload = {
        status: draft.status || DEFAULT_PROGRESS_STATUS,
        note: draft.note ?? '',
        moodNote: draft.moodNote ?? '',
      };

      if (irritationLevelNumber !== null && !Number.isNaN(irritationLevelNumber)) {
        updatePayload.irritationLevel = irritationLevelNumber;
      }

      try {
        setSavingStepId(stepId);
        const existing = progressByStepToday[stepId];
        if (existing) {
          await updateRoutineProgress(existing.progressId, updatePayload);
          setFlashMessage({ type: 'success', message: 'Đã cập nhật tiến trình cho bước này.' });
        } else {
          const createPayload = {
            instanceId: selectedInstanceId,
            stepId,
            completedAt: new Date().toISOString(),
            status: updatePayload.status,
            note: updatePayload.note,
            moodNote: updatePayload.moodNote,
          };
          if (updatePayload.irritationLevel !== undefined) {
            createPayload.irritationLevel = updatePayload.irritationLevel;
          }
          await createRoutineProgress(createPayload);
          setFlashMessage({ type: 'success', message: 'Đã ghi nhận tiến trình cho bước này.' });
        }
        await refreshProgress();
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          'Không thể cập nhật tiến trình lúc này. Vui lòng thử lại sau.';
        setFlashMessage({ type: 'error', message });
      } finally {
        setSavingStepId('');
      }
    },
    [progressDrafts, progressByStepToday, selectedInstanceId, refreshProgress]
  );

  const handleFeedbackChange = useCallback((field, value) => {
    setFeedbackDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleFeedbackSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!selectedRoutineId || !currentUserId) {
        setFlashMessage({ type: 'error', message: 'Bạn cần chọn lộ trình để gửi phản hồi.' });
        return;
      }

      const ratingValue = Number(feedbackDraft.rating);
      if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
        setFlashMessage({ type: 'error', message: 'Vui lòng chọn mức đánh giá từ 1 đến 5.' });
        return;
      }

      try {
        setFeedbackSubmitting(true);
        const payload = {
          routineId: selectedRoutineId,
          userId: currentUserId,
          rating: ratingValue,
        };
        if (feedbackDraft.stepId) {
          payload.stepId = feedbackDraft.stepId;
        }
        const trimmedComment = feedbackDraft.comment?.trim();
        if (trimmedComment) {
          payload.comment = trimmedComment;
        }

        await createFeedback(payload);
        setFlashMessage({ type: 'success', message: 'Cảm ơn bạn đã gửi phản hồi!' });
        setFeedbackDraft({ rating: '5', comment: '', stepId: '' });
      } catch (error) {
        const message =
          error?.response?.data?.message || 'Không thể gửi phản hồi lúc này. Vui lòng thử lại sau.';
        setFlashMessage({ type: 'error', message });
      } finally {
        setFeedbackSubmitting(false);
      }
    },
    [feedbackDraft, selectedRoutineId, currentUserId]
  );

  return (
    <div className={cx('skincare-routine')}>
      <div className={cx('container')}>
        {/* Header */}
        <div className={cx('header')}>
          <h1 className={cx('title')}>{headerTitle}</h1>

          <p className={cx('subtitle')}>
            Routine chăm sóc da được cá nhân hóa dựa trên kết quả phân tích AI
          </p>

          {/* Routine selector */}
          <div style={{ marginTop: '1rem' }}>
            {routineInstances.length > 0 ? (
              <select
                value={selectedInstanceId}
                onChange={(e) => {
                  const instanceId = e.target.value;
                  setSelectedInstanceId(instanceId);
                  const instance = routineInstances.find((i) => i.instanceId === instanceId);
                  setSelectedRoutineId(instance?.routineId || '');
                  const detail = instance?.routineId ? routineDetails[instance.routineId] : null;
                  if (detail?.name || detail?.Name) {
                    setHeaderTitle(detail.name || detail.Name);
                  }
                }}
                style={{ padding: '8px 12px', borderRadius: 8 }}
              >
                {routineInstances.map((instance) => {
                  const rid = instance.routineId;
                  const detail = rid ? routineDetails[rid] : null;
                  const labelFromDetail =
                    detail?.name || detail?.Name || detail?.description || detail?.Description;
                  const dateLabel = instance.startDate ? `Bắt đầu: ${instance.startDate}` : null;
                  const label = labelFromDetail || dateLabel || `Routine ${rid?.slice(0, 8) || ''}`;
                  return (
                    <option key={instance.instanceId} value={instance.instanceId}>
                      {label}
                    </option>
                  );
                })}
              </select>
            ) : (
              <span>Chưa có lộ trình nào.</span>
            )}
          </div>
        </div>

        {flashMessage && (
          <div
            className={cx(
              'flash-message',
              flashMessage.type === 'error' ? 'flash-message-error' : 'flash-message-success'
            )}
          >
            {flashMessage.message}
          </div>
        )}

        {progressLoading && !savingStepId && (
          <div className={cx('flash-message', 'flash-message-info')}>
            Đang đồng bộ tiến trình gần nhất...
          </div>
        )}

        <div ref={routineSectionRef} className={cx('routine-grid')}>
          {/* Morning Routine */}
          <div className={cx('routine-card', 'morning-card')}>
            <div className={cx('card-header')}>
              <div className={cx('icon-wrapper', 'morning-icon')}>
                <span>☀</span>
              </div>
              <h2 className={cx('card-title')}>Routine Buổi Sáng</h2>
            </div>

            <div className={cx('steps-container')}>
              {loading && <div>Đang tải...</div>}
              {!loading && morningSteps.length === 0 && (
                <div className={cx('step-item')}>
                  <div className={cx('step-content')}>
                    <p className={cx('step-description')}>Chưa có bước nào cho buổi sáng.</p>
                  </div>
                </div>
              )}
              {!loading &&
                morningSteps
                  .sort((a, b) => a.stepOrder - b.stepOrder)
                  .map((s, idx) => renderStepItem(s, idx, 'morning-step'))}
            </div>
          </div>

          <div className={cx('routine-card', 'evening-card')}>
            <div className={cx('card-header')}>
              <div className={cx('icon-wrapper', 'evening-icon')}>
                <span>🌙</span>
              </div>
              <h2 className={cx('card-title')}>Routine Buổi Tối</h2>
            </div>

            <div className={cx('steps-container')}>
              {loading && <div>Đang tải...</div>}
              {!loading && eveningSteps.length === 0 && (
                <div className={cx('step-item')}>
                  <div className={cx('step-content')}>
                    <p className={cx('step-description')}>Chưa có bước nào cho buổi tối.</p>
                  </div>
                </div>
              )}
              {!loading &&
                eveningSteps
                  .sort((a, b) => a.stepOrder - b.stepOrder)
                  .map((s, idx) => renderStepItem(s, idx, 'evening-step'))}
            </div>
          </div>

          {/* Weekly Routine */}
          <div className={cx('routine-card', 'weekly-card')}>
            <div className={cx('card-header')}>
              <div className={cx('icon-wrapper', 'weekly-icon')}>
                <span>📅</span>
              </div>
              <h2 className={cx('card-title')}>Routine Hằng Tuần</h2>
            </div>

            <div className={cx('steps-container')}>
              {loading && <div>Đang tải...</div>}
              {!loading && weeklySteps.length === 0 && (
                <div className={cx('step-item')}>
                  <div className={cx('step-content')}>
                    <p className={cx('step-description')}>Chưa có bước hằng tuần.</p>
                  </div>
                </div>
              )}
              {!loading &&
                weeklySteps
                  .sort((a, b) => a.stepOrder - b.stepOrder)
                  .map((s, idx) => renderStepItem(s, idx, 'weekly-step'))}
            </div>
          </div>

          {otherSteps.length > 0 && (
            <div className={cx('routine-card', 'other-card')}>
              <div className={cx('card-header')}>
                <div className={cx('icon-wrapper', 'other-icon')}>
                  <span>🧴</span>
                </div>
                <h2 className={cx('card-title')}>Các Bước Khác</h2>
              </div>

              <div className={cx('steps-container')}>
                {loading && <div>Đang tải...</div>}
                {!loading &&
                  otherSteps
                    .sort((a, b) => a.stepOrder - b.stepOrder)
                    .map((s, idx) => renderStepItem(s, idx, 'other-step'))}
              </div>
            </div>
          )}
        </div>

        <div className={cx('experience-panel')}>
          <h2>Chia sẻ trải nghiệm</h2>
          <p>
            Đánh giá giúp AI tinh chỉnh lộ trình tốt hơn cho bạn. Nếu một bước chưa phù hợp, bạn có
            thể ghi chú để chúng tôi điều chỉnh.
          </p>

          <form className={cx('feedback-form')} onSubmit={handleFeedbackSubmit}>
            <div className={cx('feedback-row')}>
              <label>Mức hài lòng chung</label>
              <select
                value={feedbackDraft.rating}
                onChange={(e) => handleFeedbackChange('rating', e.target.value)}
                disabled={feedbackSubmitting}
              >
                <option value="5">😍 5 - Rất hài lòng</option>
                <option value="4">😊 4 - Hài lòng</option>
                <option value="3">😐 3 - Bình thường</option>
                <option value="2">😕 2 - Chưa tốt</option>
                <option value="1">😞 1 - Tệ</option>
              </select>
            </div>

            <div className={cx('feedback-row')}>
              <label>Bước muốn góp ý (Không bắt buộc)</label>
              <select
                value={feedbackDraft.stepId}
                onChange={(e) => handleFeedbackChange('stepId', e.target.value)}
                disabled={feedbackSubmitting}
              >
                <option value="">Tất cả các bước</option>
                {steps.map((step) => (
                  <option key={step.stepId} value={step.stepId}>
                    Bước {step.stepOrder}: {step.instruction}
                  </option>
                ))}
              </select>
            </div>

            <div className={cx('feedback-row')}>
              <label>Nhận xét</label>
              <textarea
                value={feedbackDraft.comment}
                onChange={(e) => handleFeedbackChange('comment', e.target.value)}
                placeholder="Chia sẻ điều bạn thích hoặc muốn cải thiện"
                rows={3}
                disabled={feedbackSubmitting}
              />
            </div>

            <button type="submit" disabled={feedbackSubmitting} className={cx('feedback-submit')}>
              {feedbackSubmitting ? 'Đang gửi...' : 'Gửi phản hồi'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Routine;
