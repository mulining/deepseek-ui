import React from 'react';

const MessageBubble = ({ message }) => {
  return (
    <div className={`message ${message.sender}-message`}>
      <div className="message-content">
        {message.text}
      </div>
    </div>
  );
};

export default MessageBubble;