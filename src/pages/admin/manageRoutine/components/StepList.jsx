import React from 'react';
import classNames from 'classnames/bind';
import styles from '../ManageRoutine.module.scss';

const cx = classNames.bind(styles);

function StepList({ steps = [], onEdit, onDelete }) {
  if (!steps?.length) return <div>Chưa có step</div>;

  return (
    <div className={cx('list')}>
      {steps
        .slice()
        .sort((a, b) => (a.stepOrder ?? 0) - (b.stepOrder ?? 0))
        .map((s) => (
          <div key={s.stepId} className={cx('item')}>
            <div className={cx('itemTitle')}>
              <b>#{s.stepOrder}</b> • {s.instruction || '(No instruction)'}
            </div>
            <div className={cx('itemMeta')}>
              <span className={cx('chip')}>{s.timeOfDay || '-'}</span>
              <span className={cx('chip')}>{s.frequency || '-'}</span>
              <button className={cx('btn', 'sm')} onClick={() => onEdit?.(s)}>
                Sửa
              </button>
              <button className={cx('btn', 'danger', 'sm')} onClick={() => onDelete?.(s.stepId)}>
                Xóa
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

export default StepList;
