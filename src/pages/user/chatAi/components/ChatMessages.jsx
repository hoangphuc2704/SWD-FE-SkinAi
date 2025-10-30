import React from 'react';
import classNames from 'classnames/bind';
import styles from '../ChatAi.module.scss';

const cx = classNames.bind(styles);

/**
 * Component hiển thị danh sách messages trong chat
 */
function ChatMessages({ messages, loading, messagesEndRef }) {
  return (
    <div className={cx('messagesContainer')}>
      {messages.map((msg, index) => (
        <div
          key={index}
          className={cx('chatMessage', msg.role === 'user' ? 'userMessage' : 'assistantMessage')}
        >
          {msg.imageUrl && (
            <img src={msg.imageUrl} alt="Skin analysis" className={cx('messageImage')} />
          )}
          <div className={cx('messageContent')}>{msg.content}</div>
          <div className={cx('messageTime')}>
            {new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      ))}
      {loading && (
        <div className={cx('chatMessage', 'assistantMessage')}>
          <div className={cx('typing')}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatMessages;

