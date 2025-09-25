import React from 'react';
import classNames from 'classnames/bind';
import styles from './Routine.module.scss';
const cx = classNames.bind(styles);

function Routine() {
  const morningRoutine = [
    {
      step: 1,
      title: 'Làm sạch da',
      description: 'Sữa rửa mặt nhẹ nhẹ',
    },
    {
      step: 2,
      title: 'Toner',
      description: 'Cân bằng độ pH cho da',
    },
    {
      step: 3,
      title: 'Serum',
      description: 'Tinh chất dưỡng da',
    },
    {
      step: 4,
      title: 'Kem chống nắng',
      description: 'Bảo vệ da khỏi tia UV',
    },
  ];

  const eveningRoutine = [
    {
      step: 1,
      title: 'Tẩy trang',
      description: 'Loại bỏ makeup và bụi bẩn',
    },
    {
      step: 2,
      title: 'Làm sạch',
      description: 'Sữa rửa mặt làm sạch sâu',
    },
    {
      step: 3,
      title: 'Treatment',
      description: 'Serum đặc trị ban đêm',
    },
    {
      step: 4,
      title: 'Kem dưỡng đêm',
      description: 'Phục hồi da qua đêm',
    },
  ];

  return (
    <div className={cx('skincare-routine')}>
      <div className={cx('container')}>
        {/* Header */}
        <div className={cx('header')}>
          <h1 className={cx('title')}>Quy Trình Chăm Sóc Da</h1>

          <p className={cx('subtitle')}>
            Routine chăm sóc da được cá nhân hóa dựa trên kết quả phân tích AI
          </p>
        </div>

        <div className={cx('routine-grid')}>
          {/* Morning Routine */}
          <div className={cx('routine-card', 'morning-card')}>
            <div className={cx('card-header')}>
              <div className={cx('icon-wrapper', 'morning-icon')}>
                <span>☀</span>
              </div>
              <h2 className={cx('card-title')}>Routine Buổi Sáng</h2>
            </div>

            <div className={cx('steps-container')}>
              {morningRoutine.map((item) => (
                <div key={item.step} className={cx('step-item')}>
                  <div className={cx('step-number', 'morning-step')}>{item.step}</div>
                  <div className={cx('step-content')}>
                    <h3 className={cx('step-title')}>{item.title}</h3>
                    <p className={cx('step-description')}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={cx('routine-card', 'evening-card')}>
            <div className={cx('card-header')}>
              <div className={cx('icon-wrapper', 'evening-icon')}>
                <span>🌙</span>
              </div>
              <h2 className={cx('card-title')}>Routine Buổi Tối</h2>
            </div>

            <div className={cx('steps-container')}>
              {eveningRoutine.map((item) => (
                <div key={item.step} className={cx('step-item')}>
                  <div className={cx('step-number', 'evening-step')}>{item.step}</div>
                  <div className={cx('step-content')}>
                    <h3 className={cx('step-title')}>{item.title}</h3>
                    <p className={cx('step-description')}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Routine;
