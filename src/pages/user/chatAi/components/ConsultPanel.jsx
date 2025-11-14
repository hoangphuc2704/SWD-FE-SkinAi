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
        <div className={cx('consultModes')}>
          <strong>Bạn có thể chọn một trong hai cách:</strong>
          <ul>
            <li>Hoàn thành bộ 3 bước ở dưới để AI có thêm dữ liệu trước khi phân tích ảnh.</li>
            <li>
              Mô tả trực tiếp tình trạng da trong cuộc trò chuyện; AI vẫn sẽ gợi ý routine phù hợp.
            </li>
          </ul>
        </div>
        <div className={cx('consultContent')}>
          <ProblemSelector selectedProblem={selectedProblem} onSelect={onProblemSelect} />
          <SkinTypeSelector selectedSkinType={selectedSkinType} onSelect={onSkinTypeSelect} />
        </div>
      </div>

      {/* Ready box */}
      <div className={cx('readyBox')}>
        <h4>Bạn đã sẵn sàng?</h4>
        <p>
          Hãy trò chuyện với AI ở bên trái: bạn có thể mô tả tình trạng da hoặc đặt câu hỏi bất kỳ,
          hệ thống sẽ tự động gợi ý routine tương ứng.
        </p>
        {selectedProblem && selectedSkinType && !hasAnalyzedImage && (
          <p className={cx('readyHint')}>
            Bạn đã cung cấp thông tin nền tảng. Nếu muốn, bạn có thể tải hoặc chụp một bức ảnh để
            tôi phân tích sâu hơn bất cứ lúc nào trong cuộc trò chuyện.
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
