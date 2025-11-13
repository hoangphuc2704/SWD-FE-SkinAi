import React from 'react';
import classNames from 'classnames/bind';
import styles from '../ChatAi.module.scss';
import FeatureCards from './FeatureCards';
import ProblemSelector from './ProblemSelector';
import SkinTypeSelector from './SkinTypeSelector';

const cx = classNames.bind(styles);

/**
 * Component panel bên phải chứa tính năng và lựa chọn
 */
function ConsultPanel({
  selectedProblem,
  selectedSkinType,
  hasAnalyzedImage,
  onProblemSelect,
  onSkinTypeSelect,
}) {
  return (
    <div className={cx('chatRight')}>
      {/* 3 ô tính năng */}
      <FeatureCards />

      {/* Bắt đầu tư vấn */}
      <div className={cx('consultBox')}>
        <h3>Bắt đầu tư vấn ngay</h3>
        <div className={cx('consultContent')}>
          <ProblemSelector selectedProblem={selectedProblem} onSelect={onProblemSelect} />
          <SkinTypeSelector selectedSkinType={selectedSkinType} onSelect={onSkinTypeSelect} />
        </div>
      </div>

      {/* Ready box */}
      <div className={cx('readyBox')}>
        <h4>Bạn đã sẵn sàng?</h4>
        <p>
          Hãy bắt đầu cuộc trò chuyện với AI tư vấn chăm sóc da bên trái để nhận được lời khuyên cá
          nhân hóa.
        </p>
        {selectedProblem && selectedSkinType && !hasAnalyzedImage && (
          <p className={cx('readyHint')}>
            Bạn đã cung cấp thông tin nền tảng. Tải hoặc chụp một bức ảnh để tôi phân tích trước rồi
            mình cùng trao đổi nhé!
          </p>
        )}
        {selectedProblem && selectedSkinType && hasAnalyzedImage && (
          <p className={cx('readyHint')}>
            Ảnh đã được phân tích. Giờ thì thoải mái đặt câu hỏi để tôi đề xuất routine phù hợp nhé!
          </p>
        )}
      </div>
    </div>
  );
}

export default ConsultPanel;
