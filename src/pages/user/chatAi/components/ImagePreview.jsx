import React from 'react';
import classNames from 'classnames/bind';
import styles from '../ChatAi.module.scss';

const cx = classNames.bind(styles);

/**
 * Component hiển thị preview ảnh đã chọn
 */
function ImagePreview({ imagePreview, onRemove, onAnalyze, analyzing, disabled = false }) {
  if (!imagePreview) return null;

  return (
    <div className={cx('imagePreview')}>
      <img src={imagePreview} alt="Preview" />
      <button onClick={onRemove} className={cx('removeImage')}>
        <i className="fa-solid fa-times"></i>
      </button>
      <button onClick={onAnalyze} className={cx('analyzeBtn')} disabled={analyzing || disabled}>
        {analyzing ? 'Đang phân tích...' : 'Phân tích ảnh'}
      </button>
    </div>
  );
}

export default ImagePreview;
