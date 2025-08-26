import React, { useState } from 'react';

const MessageInput = ({ onSendMessage }) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <form className="input-area" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="输入您的问题..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button type="submit">发送</button>
    </form>
  );
};

export default MessageInput;