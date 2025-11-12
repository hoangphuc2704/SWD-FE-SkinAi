import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Routine.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProfile } from '../../../apis/userApi';
import { getRoutinesByUserId } from '../../../apis/routineApi';
import { getRoutineStepsByRoutineId } from '../../../apis/routineStepApi';
const cx = classNames.bind(styles);

function Routine() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [routines, setRoutines] = useState([]);
  const [selectedRoutineId, setSelectedRoutineId] = useState('');
  const [steps, setSteps] = useState([]);

  // Fetch routines list unless a preferred routineId is provided
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const preferredId = location.state?.routineId;
        const preferredUserId = location.state?.userId;

        // Nếu có preferredId, ưu tiên hiển thị routine đó và KHÔNG gọi /me
        if (preferredId) {
          setSelectedRoutineId(preferredId);
          // Optional: nếu có userId thì lấy danh sách routines cho selector, không cần /me
          if (preferredUserId) {
            try {
              const r = await getRoutinesByUserId(preferredUserId);
              setRoutines(r?.data || []);
            } catch {
              setRoutines([]);
            }
          }
          return; // bỏ qua phần lấy profile
        }

        // Không có preferredId -> dùng userId từ localStorage nếu có, nếu không thì /me
        let uid = undefined;
        try {
          const stored = localStorage.getItem('user');
          if (stored) {
            const u = JSON.parse(stored);
            uid = u?.id || u?.userId || uid;
          }
        } catch {
          // ignore JSON parse errors
        }

        if (!uid) {
          try {
            const profile = await getProfile();
            uid = profile?.data?.id;
          } catch {
            uid = undefined;
          }
        }

        if (uid) {
          try {
            const r = await getRoutinesByUserId(uid);
            const list = r?.data || [];
            setRoutines(list);
            if (list.length > 0) {
              const latest = [...list].sort((a, b) => {
                const ta = new Date(a.updatedAt || a.createdAt || a.startDate || 0).getTime();
                const tb = new Date(b.updatedAt || b.createdAt || b.startDate || 0).getTime();
                return tb - ta;
              })[0];
              setSelectedRoutineId(latest.id || latest.routineId);
            }
          } catch {
            console.warn('Routine list fetch failed without preferredId');
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
  }, [navigate, location.state?.routineId, location.state?.userId]);

  // Fetch steps when routine changes
  useEffect(() => {
    const fetchSteps = async () => {
      if (!selectedRoutineId) return;
      try {
        setLoading(true);
        const res = await getRoutineStepsByRoutineId(selectedRoutineId);
        setSteps(res?.data || []);
      } catch (e) {
        console.error('Error loading steps:', e);
        setSteps([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSteps();
  }, [selectedRoutineId]);

  const weeklySteps = useMemo(() => (steps || []).filter((s) => s.frequency === 'weekly'), [steps]);
  const morningSteps = useMemo(
    () =>
      (steps || []).filter(
        (s) => (s.timeOfDay === 'morning' || s.timeOfDay === 'both') && s.frequency !== 'weekly'
      ),
    [steps]
  );
  const eveningSteps = useMemo(
    () =>
      (steps || []).filter(
        (s) => (s.timeOfDay === 'evening' || s.timeOfDay === 'both') && s.frequency !== 'weekly'
      ),
    [steps]
  );

  return (
    <div className={cx('skincare-routine')}>
      <div className={cx('container')}>
        {/* Header */}
        <div className={cx('header')}>
          <h1 className={cx('title')}>Quy Trình Chăm Sóc Da</h1>

          <p className={cx('subtitle')}>
            Routine chăm sóc da được cá nhân hóa dựa trên kết quả phân tích AI
          </p>

          {/* Routine selector */}
          <div style={{ marginTop: '1rem' }}>
            {routines.length > 0 ? (
              <select
                value={selectedRoutineId}
                onChange={(e) => setSelectedRoutineId(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: 8 }}
              >
                {routines.map((r) => {
                  const rid = r.id || r.routineId;
                  const label = r.name || r.description || 'Routine';
                  return (
                    <option key={rid} value={rid}>
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

        <div className={cx('routine-grid')}>
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
                  .map((s, idx) => (
                    <div key={s.stepId || idx} className={cx('step-item')}>
                      <div className={cx('step-number', 'morning-step')}>{s.stepOrder}</div>
                      <div className={cx('step-content')}>
                        <h3 className={cx('step-title')}>{s.instruction}</h3>
                        <p className={cx('step-description')}>
                          Tần suất: {s.frequency === 'daily' ? 'Hàng ngày' : s.frequency}
                        </p>
                      </div>
                    </div>
                  ))}
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
                  .map((s, idx) => (
                    <div key={s.stepId || idx} className={cx('step-item')}>
                      <div className={cx('step-number', 'evening-step')}>{s.stepOrder}</div>
                      <div className={cx('step-content')}>
                        <h3 className={cx('step-title')}>{s.instruction}</h3>
                        <p className={cx('step-description')}>
                          Tần suất: {s.frequency === 'daily' ? 'Hàng ngày' : s.frequency}
                        </p>
                      </div>
                    </div>
                  ))}
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
                  .map((s, idx) => (
                    <div key={s.stepId || idx} className={cx('step-item')}>
                      <div className={cx('step-number', 'weekly-step')}>{s.stepOrder}</div>
                      <div className={cx('step-content')}>
                        <h3 className={cx('step-title')}>{s.instruction}</h3>
                        <p className={cx('step-description')}>Tần suất: Hằng tuần</p>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Routine;
