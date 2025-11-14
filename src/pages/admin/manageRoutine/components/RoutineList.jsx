import React from 'react';
import classNames from 'classnames/bind';
import styles from '../ManageRoutine.module.scss';

const cx = classNames.bind(styles);

function RoutineList({ routines = [], selectedRoutineId, onSelect, onEdit, onDelete }) {
  if (!routines?.length) {
    return (
      <div className={cx('list')}>
        <p className={cx('aiEmpty')}>Chưa có routine nào.</p>
      </div>
    );
  }

  return (
    <ul className={cx('list')} role="list" aria-label="Danh sách routines">
      {routines.map((routine) => (
        <li
          key={routine.routineId}
          className={cx('item', { active: routine.routineId === selectedRoutineId })}
          onClick={() => onSelect?.(routine.routineId)}
          role="button"
          tabIndex={0}
          aria-selected={routine.routineId === selectedRoutineId}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onSelect?.(routine.routineId);
            }
          }}
        >
          <div className={cx('itemTitle')}>{routine.description || '(Không có mô tả)'}</div>
          <div className={cx('itemMeta')}>
            <span className={cx('badge')} aria-label={`Trạng thái: ${routine.status}`}>
              {routine.status || 'unknown'}
            </span>
            <button
              type="button"
              className={cx('btn', 'sm')}
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(routine.routineId);
              }}
              aria-label={`Sửa routine ${routine.description}`}
            >
              Sửa
            </button>
            <button
              type="button"
              className={cx('btn', 'danger', 'sm')}
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(routine.routineId);
              }}
              aria-label={`Xóa routine ${routine.description}`}
            >
              Xóa
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default RoutineList;
