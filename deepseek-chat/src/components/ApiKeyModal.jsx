import React, { useState } from 'react';

const ApiKeyModal = ({ isOpen, onSubmit }) => {
  const [apiKey, setApiKey] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSubmit(apiKey);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>设置API密钥</h2>
        <p>请输入您的DeepSeek API密钥以开始使用</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="输入DeepSeek API密钥"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <button type="submit">确认</button>
        </form>
      </div>
    </div>
  );
};

export default ApiKeyModal;