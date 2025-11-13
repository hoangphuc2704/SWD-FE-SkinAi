import React, { useRef } from 'react';
import classNames from 'classnames/bind';
import styles from '../ChatAi.module.scss';

const cx = classNames.bind(styles);

/**
 * Component input box để gửi tin nhắn và upload ảnh
 */
function ChatInput({ value, onChange, onSend, onImageSelect, disabled }) {
  const fileInputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !disabled) {
      onSend();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div className={cx('chatInputBox')}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className={cx('imageBtn')}
        title="Chụp/Tải ảnh da"
      >
        <i className="fa-solid fa-camera"></i>
      </button>
      <input
        type="text"
        placeholder="Nhập câu hỏi của bạn..."
        className={cx('chatInput')}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button className={cx('sendBtn')} onClick={onSend} disabled={disabled}>
        <i className="fa-solid fa-paper-plane"></i>
      </button>
    </div>
  );
}

export default ChatInput;
