import React from 'react';
import classNames from 'classnames/bind';
import styles from '../ManageRoutine.module.scss';

const cx = classNames.bind(styles);

function RoutineForm({
  editingRoutineId,
  routineForm,
  onChange,
  onSubmitCreate,
  onSubmitUpdate,
  onCancelEdit,
}) {
  return (
    <div className={cx('formCard')}>
      <h4>{editingRoutineId ? 'Cập nhật Routine' : 'Tạo Routine mới'}</h4>
      <form onSubmit={editingRoutineId ? onSubmitUpdate : onSubmitCreate}>
        <div className={cx('formRow')}>
          <label>User ID (UUID)</label>
          <input
            name="userId"
            placeholder="Tự động lấy từ token sau khi đăng nhập"
            value={routineForm.userId}
            onChange={onChange}
            disabled
          />
        </div>
        <div className={cx('formRow')}>
          <label>Analysis ID (UUID)</label>
          <input name="analysisId" value={routineForm.analysisId} onChange={onChange} />
        </div>
        <div className={cx('formRow')}>
          <label>Mô tả</label>
          <input name="description" value={routineForm.description} onChange={onChange} />
        </div>
        <div className={cx('formRow')}>
          <label>Parent Routine ID (UUID)</label>
          <input name="parentRoutineId" value={routineForm.parentRoutineId} onChange={onChange} />
        </div>
        <div className={cx('formRow')}>
          <label>Trạng thái</label>
          <select name="status" value={routineForm.status} onChange={onChange}>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
            <option value="paused">paused</option>
            <option value="completed">completed</option>
          </select>
        </div>
        <div className={cx('actions')}>
          <button className={cx('btn', 'primary')} type="submit">
            {editingRoutineId ? 'Cập nhật' : 'Tạo mới'}
          </button>
          {editingRoutineId && (
            <button type="button" className={cx('btn')} onClick={onCancelEdit}>
              Hủy
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default RoutineForm;
