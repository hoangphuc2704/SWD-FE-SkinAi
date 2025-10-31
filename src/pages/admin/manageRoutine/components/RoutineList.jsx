import React from 'react';
import classNames from 'classnames/bind';
import styles from '../ManageRoutine.module.scss';

const cx = classNames.bind(styles);

function RoutineList({ routines = [], selectedRoutineId, onSelect, onEdit, onDelete }) {
  return (
    <div className={cx('list')}>
      {routines?.length ? (
        routines.map((r) => (
          <div
            key={r.id}
            className={cx('item', { active: r.id === selectedRoutineId })}
            onClick={() => onSelect?.(r.id)}
          >
            <div className={cx('itemTitle')}>{r.description || '(Không mô tả)'}</div>
            <div className={cx('itemMeta')}>
              <span className={cx('badge')}>{r.status || 'unknown'}</span>
              <button
                className={cx('btn', 'sm')}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(r.id);
                }}
              >
                Sửa
              </button>
              <button
                className={cx('btn', 'danger', 'sm')}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(r.id);
                }}
              >
                Xóa
              </button>
            </div>
          </div>
        ))
      ) : (
        <div>Chưa có routine</div>
      )}
    </div>
  );
}

export default RoutineList;
