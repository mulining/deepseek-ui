import React from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages }) => {
  return (
    <div className="chat-container">
      {messages.map(message => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
};

export default MessageList;