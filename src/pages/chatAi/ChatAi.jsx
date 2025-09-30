import React from 'react';
import classNames from 'classnames/bind';
import styles from './ChatAi.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/button/Button';
const cx = classNames.bind(styles);

function ChatAi() {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <div className={cx('wrapper')}>
      {/* Cột bên trái (chat box) */}
      <Button onClick={handleGoBack} className={cx('backBtn')}>
        <i class="fa-solid fa-left-long"></i>
      </Button>
      <div className={cx('chatLeft')}>
        <div className={cx('chatMessage')}>
          Xin chào! Tôi là AI tư vấn chăm sóc da. Bạn có câu hỏi gì về da không?
        </div>

        <div className={cx('chatInputBox')}>
          <input type="text" placeholder="Nhập câu hỏi của bạn..." className={cx('chatInput')} />
          <button className={cx('sendBtn')}>
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>

      {/* Cột bên phải (tính năng & lựa chọn) */}
      <div className={cx('chatRight')}>
        {/* 3 ô tính năng */}
        <div className={cx('featureCards')}>
          <div className={cx('featureCard')}>
            <h4>Phân tích da</h4>
            <p>
              AI phân tích tình trạng da của bạn và đưa ra lời khuyên cá nhân hóa phù hợp với từng
              loại da.
            </p>
          </div>
          <div className={cx('featureCard')}>
            <h4>Tư vấn sản phẩm</h4>
            <p>Gợi ý các sản phẩm chăm sóc da phù hợp với ngân sách và nhu cầu cụ thể của bạn.</p>
          </div>
          <div className={cx('featureCard')}>
            <h4>Lộ trình chăm sóc</h4>
            <p>
              Xây dựng quy trình chăm sóc da hàng ngày với các bước chi tiết và thời gian thực hiện.
            </p>
          </div>
        </div>

        {/* Bắt đầu tư vấn */}
        <div className={cx('consultBox')}>
          <h3>Bắt đầu tư vấn ngay</h3>
          <div className={cx('consultContent')}>
            <div className={cx('problems')}>
              <h5>Các vấn đề phổ biến:</h5>
              <button>Mụn trứng cá và mụn đầu đen</button>
              <button>Da khô và bong tróc</button>
              <button>Da nhờn và lỗ chân lông to</button>
              <button>Nám và tàn nhang</button>
              <button>Lão hóa và nếp nhăn</button>
            </div>

            <div className={cx('skinTypes')}>
              <h5>Loại da của bạn:</h5>
              <button>Da khô</button>
              <button>Da nhờn</button>
              <button>Da hỗn hợp</button>
              <button>Da nhạy cảm</button>
              <button>Không chắc chắn</button>
            </div>
          </div>
        </div>

        <div className={cx('readyBox')}>
          <h4>Bạn đã sẵn sàng?</h4>
          <p>
            Hãy bắt đầu cuộc trò chuyện với AI tư vấn chăm sóc da bên trái để nhận được lời khuyên
            cá nhân hóa.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatAi;
