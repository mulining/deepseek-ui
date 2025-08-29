import React, { useState } from 'react';
import "./MessageBubble.css"

const userAvatar = 'https://api.iconify.design/mdi:account.svg';
const aiAvatar = 'https://api.iconify.design/mdi:robot.svg';

const MessageBubble = ({ message, onRetry }) => {
  const isUser = message.sender === 'user';
  const avatar = isUser ? userAvatar : aiAvatar;
  const isReasoning = message.type === 'reasoning';

  return (
    <div className={`message ${isUser ? 'user-message' : 'ai-message'}${isReasoning ? ' reasoning-bubble' : ''}`}>
      {/* AI消息头像在左侧 */}
      {!isUser && <img src={avatar} alt="AI" className="avatar" />}
      <div className={`message-content${message.error ? ' error' : ''}${isReasoning ? ' reasoning' : ''}`}>
        {/* AI消息时，优先展示 reasoningText，再展示 text */}
        {isReasoning ? (
          <>
            <div className="reasoning-label">
              思考过程：
            </div>
            <div className="reasoning-content">{message.text}</div>
          </>
        ) : (
          <>
            {message.text}
            {message.error && onRetry && (
              <button
                className="retry-btn"
                onClick={() => onRetry(message)}
              >
                重试
              </button>
            )}
          </>
        )}
      </div>
      {/* 用户消息头像在右侧 */}
      {isUser && <img src={avatar} alt="用户" className="avatar" />}
    </div>
  );
};

export default MessageBubble;