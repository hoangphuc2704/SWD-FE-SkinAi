import React from 'react';
import classNames from 'classnames/bind';
import styles from '../ChatAi.module.scss';

const cx = classNames.bind(styles);

/**
 * Component để chọn loại da
 */
function SkinTypeSelector({ selectedSkinType, onSelect }) {
  const skinTypes = ['Da khô', 'Da nhờn', 'Da hỗn hợp', 'Da nhạy cảm', 'Không chắc chắn'];

  return (
    <div className={cx('skinTypes')}>
      <h5>Loại da của bạn:</h5>
      {skinTypes.map((skinType) => (
        <button
          key={skinType}
          className={cx({ selected: selectedSkinType === skinType })}
          onClick={() => onSelect(skinType)}
        >
          {skinType}
        </button>
      ))}
    </div>
  );
}

export default SkinTypeSelector;

