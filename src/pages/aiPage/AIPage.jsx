import React from 'react';
import classNames from 'classnames/bind';
import styles from './AIPage.module.scss';
import Button from '../../components/button/Button';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);

function AIPage() {
  const handleCardClick = (cardType) => {
    console.log(`Clicked on ${cardType} card`);
  };

  return (
    <div className={cx('ai-page')}>
      <div className={cx('container')}>
        <div className={cx('header')}>
          <h1 className={cx('title')}>Tư Vấn AI Chuyên Nghiệp</h1>
          <p className={cx('subtitle')}>
            Hệ thống AI của chúng tôi sẽ phân tích loại da và đưa ra lời khuyên chăm sóc da phù hợp
            nhất
          </p>
        </div>

        <div className={cx('cards-grid')}>
          <div className={cx('card', 'card-analysis')}>
            <div className={cx('card-content')}>
              <h3 className={cx('card-title')}>Phân Tích Da</h3>
              <p className={cx('card-description')}>
                AI phân tích ảnh da của bạn để xác định loại da và các vấn đề hiện tại
              </p>
              <Button
                small
                className={cx('card-button')}
                onClick={() => handleCardClick('analysis')}
              >
                Bắt đầu phân tích
              </Button>
            </div>
          </div>

          <div className={cx('card', 'card-chat')}>
            <div className={cx('card-content')}>
              <h3 className={cx('card-title')}>Chat Tư Vấn</h3>
              <p className={cx('card-description')}>
                Trò chuyện trực tiếp với AI để nhận lời khuyên cá nhân hóa về chăm sóc da
              </p>
              <Link to="/chatai">
                <Button small className={cx('card-button')} onClick={() => handleCardClick('chat')}>
                  Bắt đầu chat
                </Button>
              </Link>
            </div>
          </div>

          <div className={cx('card', 'card-progress')}>
            <div className={cx('card-content')}>
              <h3 className={cx('card-title')}>Theo Dõi Tiến Độ</h3>
              <p className={cx('card-description')}>
                Ghi nhận và theo dõi sự thay đổi của da theo thời gian
              </p>
              <Button
                small
                className={cx('card-button')}
                onClick={() => handleCardClick('progress')}
              >
                Xem tiến độ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIPage;
