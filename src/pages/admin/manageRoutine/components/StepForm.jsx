import React from 'react';
import classNames from 'classnames/bind';
import styles from '../ManageRoutine.module.scss';

const cx = classNames.bind(styles);

function StepForm({
  editingStepId,
  stepForm,
  onChange,
  onSubmitCreate,
  onSubmitUpdate,
  onCancelEdit,
}) {
  return (
    <div className={cx('formCard')}>
      <h4>{editingStepId ? 'Cập nhật Step' : 'Thêm Step'}</h4>
      <form onSubmit={editingStepId ? onSubmitUpdate : onSubmitCreate}>
        <div className={cx('formRow')}>
          <label>Thứ tự (&gt;= 1) *</label>
          <input
            type="number"
            min={1}
            name="stepOrder"
            value={stepForm.stepOrder}
            onChange={onChange}
            required
          />
        </div>
        <div className={cx('formRow')}>
          <label>Hướng dẫn</label>
          <input name="instruction" value={stepForm.instruction} onChange={onChange} />
        </div>
        <div className={cx('formRow', 'inline')}>
          <div>
            <label>Buổi</label>
            <select name="timeOfDay" value={stepForm.timeOfDay} onChange={onChange}>
              <option value="morning">morning</option>
              <option value="evening">evening</option>
            </select>
          </div>
          <div>
            <label>Tần suất</label>
            <select name="frequency" value={stepForm.frequency} onChange={onChange}>
              <option value="daily">daily</option>
              <option value="weekly">weekly</option>
            </select>
          </div>
        </div>
        <div className={cx('actions')}>
          <button className={cx('btn', 'primary')} type="submit">
            {editingStepId ? 'Cập nhật' : 'Thêm'}
          </button>
          {editingStepId && (
            <button type="button" className={cx('btn')} onClick={onCancelEdit}>
              Hủy
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default StepForm;
