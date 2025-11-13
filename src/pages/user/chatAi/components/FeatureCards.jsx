import React from 'react';
import classNames from 'classnames/bind';
import styles from '../ChatAi.module.scss';

const cx = classNames.bind(styles);

/**
 * Component hiển thị 3 ô tính năng chính
 */
function FeatureCards() {
  const features = [
    {
      title: 'Phân tích da',
      description:
        'AI phân tích tình trạng da của bạn và đưa ra lời khuyên cá nhân hóa phù hợp với từng loại da.',
    },
    {
      title: 'Tư vấn sản phẩm',
      description: 'Gợi ý các sản phẩm chăm sóc da phù hợp với ngân sách và nhu cầu cụ thể của bạn.',
    },
    {
      title: 'Lộ trình chăm sóc',
      description:
        'Xây dựng quy trình chăm sóc da hàng ngày với các bước chi tiết và thời gian thực hiện.',
    },
  ];

  return (
    <div className={cx('featureCards')}>
      {features.map((feature, index) => (
        <div key={index} className={cx('featureCard')}>
          <h4>{feature.title}</h4>
          <p>{feature.description}</p>
        </div>
      ))}
    </div>
  );
}

export default FeatureCards;

