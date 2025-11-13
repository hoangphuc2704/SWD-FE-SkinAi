import React from 'react';
import classNames from 'classnames/bind';
import styles from './AboutUs.module.scss';
import Button from '../../../components/button/Button';

const cx = classNames.bind(styles);

function AboutUs() {
  const features = [
    {
      icon: '🤖',
      title: 'AI Thông Minh',
      description:
        'Công nghệ AI tiên tiến được đào tạo bởi chuyên gia da liễu với hàng nghìn ca tư vấn thành công.',
    },
    {
      icon: '🔬',
      title: 'Phân Tích Chuyên Sâu',
      description:
        'Phân tích tình trạng da dựa trên hình ảnh và thông tin cá nhân để đưa ra lời khuyên chính xác.',
    },
    {
      icon: '📋',
      title: 'Lộ Trình Cá Nhân Hóa',
      description:
        'Tạo ra lộ trình chăm sóc da hoàn toàn phù hợp với nhu cầu và điều kiện của từng người.',
    },
  ];

  const stats = [
    { number: '50,000+', label: 'Người dùng tin tưởng' },
    { number: '95%', label: 'Độ hài lòng khách hàng' },
    { number: '1000+', label: 'Sản phẩm được phân tích' },
    { number: '24/7', label: 'Hỗ trợ trực tuyến' },
  ];

  return (
    <div className={cx('about-us')}>
      {/* Hero Section */}
      <section className={cx('hero')}>
        <div className={cx('container')}>
          <div className={cx('hero-content')}>
            <div className={cx('hero-text')}>
              <h1 className={cx('hero-title')}>
                Về Chúng Tôi
                <span className={cx('highlight')}> SkinCare AI</span>
              </h1>
              <p className={cx('hero-description')}>
                Chúng tôi là đội ngũ chuyên gia kết hợp giữa công nghệ AI tiên tiến và kiến thức
                chuyên môn trong lĩnh vực chăm sóc da, mang đến giải pháp tư vấn thông minh và cá
                nhân hóa cho mọi người.
              </p>
            </div>
            <div className={cx('hero-image')}>
              <div className={cx('hero-illustration')}>
                <div className={cx('ai-icon')}>🧠</div>
                <div className={cx('skin-icon')}>✨</div>
                <div className={cx('chat-icon')}>💬</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className={cx('mission')}>
        <div className={cx('container')}>
          <div className={cx('section-header')}>
            <h2 className={cx('section-title')}>Sứ Mệnh Của Chúng Tôi</h2>
            <p className={cx('section-subtitle')}>
              Democratizing skincare knowledge through AI technology
            </p>
          </div>
          <div className={cx('mission-content')}>
            <div className={cx('mission-text')}>
              <h3>Làm cho chăm sóc da chuyên nghiệp trở nên dễ tiếp cận</h3>
              <p>
                Chúng tôi tin rằng mọi người đều xứng đáng có được lời tư vấn chăm sóc da chất lượng
                cao. Bằng cách kết hợp công nghệ AI với kiến thức chuyên môn từ các bác sĩ da liễu
                hàng đầu, chúng tôi tạo ra một nền tảng có thể cung cấp lời khuyên cá nhân hóa,
                chính xác và dễ hiểu cho mọi loại da.
              </p>
              <ul className={cx('mission-points')}>
                <li> Tư vấn chính xác dựa trên phân tích AI</li>
                <li> Lộ trình cá nhân hóa cho từng loại da</li>
                <li> Kiến thức được cập nhật từ chuyên gia</li>
                <li> An toàn và hiệu quả đã được kiểm chứng</li>
              </ul>
            </div>
            <div className={cx('mission-stats')}>
              {stats.map((stat, index) => (
                <div key={index} className={cx('stat-item')}>
                  <div className={cx('stat-number')}>{stat.number}</div>
                  <div className={cx('stat-label')}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={cx('features')}>
        <div className={cx('container')}>
          <div className={cx('section-header')}>
            <h2 className={cx('section-title')}>Tại Sao Chọn SkinCare AI?</h2>
            <p className={cx('section-subtitle')}>
              Những tính năng vượt trội giúp bạn có được làn da khỏe mạnh
            </p>
          </div>
          <div className={cx('features-grid')}>
            {features.map((feature, index) => (
              <div key={index} className={cx('feature-card')}>
                <div className={cx('feature-icon')}>{feature.icon}</div>
                <h3 className={cx('feature-title')}>{feature.title}</h3>
                <p className={cx('feature-description')}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={cx('how-it-works')}>
        <div className={cx('container')}>
          <div className={cx('section-header')}>
            <h2 className={cx('section-title')}>Cách Thức Hoạt Động</h2>
            <p className={cx('section-subtitle')}>
              3 bước đơn giản để có được lộ trình chăm sóc da hoàn hảo
            </p>
          </div>
          <div className={cx('steps')}>
            <div className={cx('step')}>
              <div className={cx('step-number')}>01</div>
              <div className={cx('step-content')}>
                <h3>Phân Tích Tình Trạng Da</h3>
                <p>Upload ảnh và trả lời các câu hỏi về tình trạng da hiện tại của bạn</p>
              </div>
            </div>
            <div className={cx('step')}>
              <div className={cx('step-number')}>02</div>
              <div className={cx('step-content')}>
                <h3>AI Xử Lý & Phân Tích</h3>
                <p>Hệ thống AI phân tích dữ liệu và so sánh với hàng nghìn trường hợp tương tự</p>
              </div>
            </div>
            <div className={cx('step')}>
              <div className={cx('step-number')}>03</div>
              <div className={cx('step-content')}>
                <h3>Nhận Lộ Trình Cá Nhân</h3>
                <p>Được cung cấp lộ trình chăm sóc da chi tiết với sản phẩm và tips phù hợp</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
