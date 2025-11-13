import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ManageRoutine.module.scss';
import { getAllRoutines } from '../../../apis/routineApi';
import { getRoutineStepsByRoutineId } from '../../../apis/routineStepApi';

const cx = classNames.bind(styles);

const normalizeRoutineList = (list) => {
  const arr = Array.isArray(list) ? list : list?.items || [];
  return arr.filter((item) => (item?.status || '').toLowerCase() !== 'archived');
};

function RoutineExplorer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [routines, setRoutines] = useState([]);
  const [selectedRoutineId, setSelectedRoutineId] = useState('');
  const [steps, setSteps] = useState([]);

  const selectedRoutine = useMemo(
    () => routines.find((r) => r.routineId === selectedRoutineId),
    [routines, selectedRoutineId]
  );

  useEffect(() => {
    let ignore = false;
    const loadRoutines = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getAllRoutines();
        const list = normalizeRoutineList(data);
        if (!ignore) {
          setRoutines(list);
          if (list.length) {
            setSelectedRoutineId((prev) => prev || list[0].routineId);
          }
        }
      } catch (e) {
        if (!ignore) {
          setError(e?.response?.data?.message || e.message || 'Không thể tải routine');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadRoutines();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedRoutineId) {
      setSteps([]);
      return;
    }

    let ignore = false;
    const loadSteps = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getRoutineStepsByRoutineId(selectedRoutineId);
        if (!ignore) {
          setSteps(Array.isArray(data) ? data : data?.items || []);
        }
      } catch (e) {
        if (!ignore) {
          setError(e?.response?.data?.message || e.message || 'Không thể tải steps');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadSteps();
    return () => {
      ignore = true;
    };
  }, [selectedRoutineId]);

  const sortedSteps = useMemo(
    () => steps.slice().sort((a, b) => (a.stepOrder ?? 0) - (b.stepOrder ?? 0)),
    [steps]
  );

  return (
    <div className={cx('container')}>
      <div className={cx('header')}>
        <h2>Routine Templates</h2>
        <p>Xem danh sách routine và các bước chi tiết</p>
      </div>

      {error && <div className={cx('error')}>{error}</div>}
      {loading && <div className={cx('loading')}>Đang tải...</div>}

      <div className={cx('grid')}>
        <section className={cx('panel')}>
          <h3>Tất cả routines</h3>
          <div className={cx('list')}>
            {routines.length ? (
              routines.map((routine) => (
                <div
                  key={routine.routineId}
                  className={cx('item', { active: routine.routineId === selectedRoutineId })}
                  onClick={() => setSelectedRoutineId(routine.routineId)}
                >
                  <div className={cx('itemTitle')}>
                    {routine.description || 'Routine không có mô tả'}
                  </div>
                  <div className={cx('itemMeta')}>
                    <span className={cx('badge')}>{routine.status || 'unknown'}</span>
                    {routine.targetSkinType && (
                      <span className={cx('chip')}>{routine.targetSkinType}</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div>Chưa có routine</div>
            )}
          </div>
        </section>

        <section className={cx('panel')}>
          <h3>Chi tiết steps</h3>
          {!selectedRoutine ? (
            <div>Chọn một routine để xem các bước.</div>
          ) : !sortedSteps.length ? (
            <div>Routine chưa có step nào.</div>
          ) : (
            <div className={cx('list')}>
              {sortedSteps.map((step) => (
                <div key={step.stepId || step.stepOrder} className={cx('item')}>
                  <div className={cx('itemTitle')}>
                    <b>#{step.stepOrder}</b> • {step.instruction || '(No instruction)'}
                  </div>
                  <div className={cx('itemMeta')}>
                    <span className={cx('chip')}>{step.timeOfDay || '-'}</span>
                    <span className={cx('chip')}>{step.frequency || '-'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default RoutineExplorer;
