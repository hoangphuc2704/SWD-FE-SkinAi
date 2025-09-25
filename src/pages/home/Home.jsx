import React from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Button from '../../components/button/Button';
import images from '../../assets/images';

const cx = classNames.bind(styles);

function Home() {
  return (
    <div className={cx('home')}>
      {/* Background decorative elements */}
      <div className={cx('bg-decoration', 'bg-decoration-1')}></div>
      <div className={cx('bg-decoration', 'bg-decoration-2')}></div>
      <div className={cx('bg-decoration', 'bg-decoration-3')}></div>
      <div className={cx('bg-decoration', 'bg-decoration-4')}></div>
      <div className={cx('bg-decoration', 'bg-decoration-5')}></div>

      <div className={cx('container')}>
        <div className={cx('home_left')}>
          <div className={cx('home_title')}>
            <h1 style={{ color: '#166534' }}>Chăm Sóc Da</h1>
            <h1 style={{ color: '#166534' }}>Thông Minh</h1>
            <h1 style={{ color: '#22C55E' }}>Với Công Nghệ AI</h1>
          </div>
          <div className={cx('home_des')}>
            Khám phá quy trình chăm sóc da cá nhân hóa
            <br />
            được thiết kế riêng cho bạn. Sử dụng AI tiên
            <br />
            tiến để phân tích loại da và đưa ra lời khuyên chuyên nghiệp.
          </div>
          <div className={cx('home_button')}>
            <Button large className={cx('btn1')}>
              Bắt đầu tư vấn
              <br />
              AI
            </Button>
            <Button large className={cx('btn2')}>
              Tìm hiểu
              <br />
              thêm
            </Button>
          </div>
        </div>
        <div className={cx('home_right')}>
          <div className={cx('interface-card')}>
            <div className={cx('images')}>
              <img src={images.brr} alt="Skincare interface" className={cx('images1')} />
              <img src={images.brrr} alt="AI analysis" className={cx('images2')} />
              <img src={images.crr} alt="Feature 1" className={cx('cr1')} />
              <img src={images.crrr} alt="Feature 2" className={cx('cr2')} />
              <img src={images.star} alt="Rating star" className={cx('star')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
