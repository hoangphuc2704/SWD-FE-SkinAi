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
    <section className={cx('formCard')} aria-labelledby="step-form-title">
      <h4 id="step-form-title">{editingStepId ? 'Cập nhật Step' : 'Thêm Step mới'}</h4>
      <form onSubmit={editingStepId ? onSubmitUpdate : onSubmitCreate}>
        <div className={cx('formRow')}>
          <label htmlFor="stepOrder">Thứ tự (từ 1 trở lên) *</label>
          <input
            id="stepOrder"
            type="number"
            min={1}
            name="stepOrder"
            value={stepForm.stepOrder}
            onChange={onChange}
            placeholder="Nhập số thứ tự"
            required
            aria-required="true"
          />
        </div>
        <div className={cx('formRow')}>
          <label htmlFor="instruction">Hướng dẫn *</label>
          <input
            id="instruction"
            type="text"
            name="instruction"
            value={stepForm.instruction}
            onChange={onChange}
            placeholder="Nhập hướng dẫn cho step này"
            required
            aria-required="true"
          />
        </div>
        <div className={cx('formRow', 'inline')}>
          <div>
            <label htmlFor="timeOfDay">Thời gian trong ngày</label>
            <select id="timeOfDay" name="timeOfDay" value={stepForm.timeOfDay} onChange={onChange}>
              <option value="morning">Buổi sáng</option>
              <option value="evening">Buổi tối</option>
            </select>
          </div>
          <div>
            <label htmlFor="frequency">Tần suất thực hiện</label>
            <select id="frequency" name="frequency" value={stepForm.frequency} onChange={onChange}>
              <option value="daily">Hàng ngày</option>
              <option value="weekly">Hàng tuần</option>
            </select>
          </div>
        </div>
        <div className={cx('actions')}>
          <button className={cx('btn', 'primary')} type="submit">
            {editingStepId ? 'Cập nhật Step' : 'Thêm Step'}
          </button>
          {editingStepId && (
            <button type="button" className={cx('btn')} onClick={onCancelEdit}>
              Hủy thao tác
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default StepForm;
