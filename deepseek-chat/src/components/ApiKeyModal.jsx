import React, { useState } from 'react';
import './ApiKeyModal.css';

const ApiKeyModal = ({ isOpen, onSubmit }) => {
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <div className="api-key-modal-mask">
      <form className="api-key-modal-card" onSubmit={handleSubmit}>
        <h2>请输入 DeepSeek API Key</h2>
        <input
          type="text"
          placeholder="sk-xxxxxx"
          value={input}
          onChange={e => setInput(e.target.value)}
          autoFocus
        />
        <button type="submit">保存</button>
      </form>
    </div>
  );
};

export default ApiKeyModal;