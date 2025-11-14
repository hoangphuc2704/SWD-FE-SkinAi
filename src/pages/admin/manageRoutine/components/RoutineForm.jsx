import React, { useMemo } from 'react';
import classNames from 'classnames/bind';
import styles from '../ManageRoutine.module.scss';

const cx = classNames.bind(styles);

const SKIN_TYPE_OPTIONS = [
  { value: '', label: '-- Chọn loại da --' },
  { value: 'normal', label: 'Da thường' },
  { value: 'dry', label: 'Da khô' },
  { value: 'oily', label: 'Da dầu' },
  { value: 'combination', label: 'Da hỗn hợp' },
  { value: 'sensitive', label: 'Da nhạy cảm' },
  { value: 'acne-prone', label: 'Da dễ mụn' },
  { value: 'mature', label: 'Da lão hóa' },
];

const CONDITION_OPTIONS = [
  'acne',
  'acne scars',
  'blackheads',
  'whiteheads',
  'redness',
  'rosacea',
  'hyperpigmentation',
  'dark spots',
  'uneven texture',
  'dullness',
  'fine lines',
  'wrinkles',
  'dehydration',
  'sun damage',
  'pore congestion',
].map((value) => ({ value, label: value }));

const ALL_CONDITIONS_VALUE = '__ALL__';

function RoutineForm({
  editingRoutineId,
  routineForm,
  onChange,
  onSubmitCreate,
  onSubmitUpdate,
  onCancelEdit,
}) {
  const selectedConditions = useMemo(() => {
    if (!routineForm.targetConditions) return [];
    const conditions = routineForm.targetConditions
      .split(/[,;]+/)
      .map((item) => item.trim())
      .filter(Boolean);

    // Check if all conditions are selected
    const allValues = CONDITION_OPTIONS.map((opt) => opt.value);
    const allSelected = allValues.every((val) => conditions.includes(val));

    return allSelected ? [ALL_CONDITIONS_VALUE, ...conditions] : conditions;
  }, [routineForm.targetConditions]);

  const handleConditionChange = (event) => {
    const values = Array.from(event.target.selectedOptions)
      .map((option) => option.value)
      .filter(Boolean);

    // If "Tất cả" is selected
    if (values.includes(ALL_CONDITIONS_VALUE)) {
      // If it was just selected, select all
      if (!selectedConditions.includes(ALL_CONDITIONS_VALUE)) {
        const allValues = CONDITION_OPTIONS.map((opt) => opt.value);
        onChange({ target: { name: 'targetConditions', value: allValues.join('; ') } });
      } else {
        // If clicking "Tất cả" again when all are selected, deselect all
        onChange({ target: { name: 'targetConditions', value: '' } });
      }
    } else {
      // Normal selection without "Tất cả"
      onChange({ target: { name: 'targetConditions', value: values.join('; ') } });
    }
  };

  return (
    <section className={cx('formCard')} aria-labelledby="routine-form-title">
      <h4 id="routine-form-title">
        {editingRoutineId ? 'Cập nhật Routine' : 'Tạo Routine mới'}
      </h4>
      <form onSubmit={editingRoutineId ? onSubmitUpdate : onSubmitCreate}>
        <div className={cx('formRow')}>
          <label htmlFor="analysisId">Analysis ID (UUID)</label>
          <input
            id="analysisId"
            name="analysisId"
            type="text"
            value={routineForm.analysisId}
            onChange={onChange}
            placeholder="Nhập Analysis ID (không bắt buộc)"
          />
        </div>
        <div className={cx('formRow')}>
          <label htmlFor="description">Mô tả *</label>
          <input
            id="description"
            name="description"
            type="text"
            value={routineForm.description}
            onChange={onChange}
            placeholder="Nhập mô tả routine"
            required
          />
        </div>
        <div className={cx('formRow')}>
          <label htmlFor="parentRoutineId">Parent Routine ID (UUID)</label>
          <input
            id="parentRoutineId"
            name="parentRoutineId"
            type="text"
            value={routineForm.parentRoutineId}
            onChange={onChange}
            placeholder="Nhập Parent Routine ID (không bắt buộc)"
          />
        </div>
        <div className={cx('formRow', 'inline')}>
          <div>
            <label htmlFor="targetSkinType">Loại da mục tiêu</label>
            <select
              id="targetSkinType"
              name="targetSkinType"
              value={routineForm.targetSkinType}
              onChange={onChange}
            >
              {SKIN_TYPE_OPTIONS.map((option) => (
                <option key={option.value || 'empty'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="targetConditions">Tình trạng da mục tiêu</label>
            <select
              id="targetConditions"
              name="targetConditions"
              multiple
              value={selectedConditions}
              onChange={handleConditionChange}
              size={Math.min(CONDITION_OPTIONS.length, 7)}
              aria-label="Chọn các tình trạng da mục tiêu"
            >
              <option
                value={ALL_CONDITIONS_VALUE}
                style={{
                  fontWeight: 'bold',
                  borderBottom: '2px solid #e5e7eb',
                  marginBottom: '4px',
                  paddingBottom: '8px',
                }}
              >
                ✓ Chọn tất cả
              </option>
              {CONDITION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <small>
              Nhấp "Chọn tất cả" để chọn/bỏ chọn tất cả. Giữ Ctrl (Windows) hoặc Command
              (macOS) để chọn nhiều mục.
            </small>
          </div>
        </div>
        <div className={cx('formRow')}>
          <label htmlFor="routineType">Loại Routine</label>
          <input
            id="routineType"
            name="routineType"
            type="text"
            value={routineForm.routineType}
            disabled
            aria-readonly="true"
          />
        </div>
        <div className={cx('formRow')}>
          <label htmlFor="status">Trạng thái</label>
          <select id="status" name="status" value={routineForm.status} onChange={onChange}>
            <option value="draft">Nháp</option>
            <option value="published">Đã xuất bản</option>
            <option value="archived">Đã lưu trữ</option>
          </select>
        </div>
        <div className={cx('actions')}>
          <button className={cx('btn', 'primary')} type="submit">
            {editingRoutineId ? 'Cập nhật Routine' : 'Tạo Routine mới'}
          </button>
          {editingRoutineId && (
            <button type="button" className={cx('btn')} onClick={onCancelEdit}>
              Hủy thao tác
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default RoutineForm;
