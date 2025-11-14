import React from 'react';
import classNames from 'classnames/bind';
import styles from '../ManageRoutine.module.scss';

const cx = classNames.bind(styles);

function StepList({ steps = [], onEdit, onDelete }) {
  if (!steps?.length) {
    return (
      <div className={cx('list')}>
        <p className={cx('aiEmpty')}>Chưa có step nào.</p>
      </div>
    );
  }

  const sortedSteps = steps.slice().sort((a, b) => (a.stepOrder ?? 0) - (b.stepOrder ?? 0));

  return (
    <ul className={cx('list')} role="list" aria-label="Danh sách steps">
      {sortedSteps.map((step) => (
        <li key={step.stepId} className={cx('item')}>
          <div className={cx('itemTitle')}>
            <strong>#{step.stepOrder}</strong>
            <span> • {step.instruction || '(Chưa có hướng dẫn)'}</span>
          </div>
          <div className={cx('itemMeta')}>
            <span className={cx('chip')} aria-label={`Buổi: ${step.timeOfDay || 'Chưa chọn'}`}>
              {step.timeOfDay || '-'}
            </span>
            <span
              className={cx('chip')}
              aria-label={`Tần suất: ${step.frequency || 'Chưa chọn'}`}
            >
              {step.frequency || '-'}
            </span>
            <button
              type="button"
              className={cx('btn', 'sm')}
              onClick={() => onEdit?.(step)}
              aria-label={`Sửa step ${step.stepOrder}`}
            >
              Sửa
            </button>
            <button
              type="button"
              className={cx('btn', 'danger', 'sm')}
              onClick={() => onDelete?.(step.stepId)}
              aria-label={`Xóa step ${step.stepOrder}`}
            >
              Xóa
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default StepList;
