import React, { useState, useEffect } from 'react';
import "./MessageInput.css"

const MODE_KEY = 'deepseek_chat_mode';

const MessageInput = ({ onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState({ deepthink: false, search: false });

  // 初始化时从 localStorage 读取模式
  useEffect(() => {
    const cachedMode = localStorage.getItem(MODE_KEY);
    if (cachedMode) {
      setMode(JSON.parse(cachedMode));
    }
  }, []);

  // 切换模式时持久化保存
  const handleModeChange = (key) => {
    setMode(prev => {
      const newMode = { ...prev, [key]: !prev[key] };
      localStorage.setItem(MODE_KEY, JSON.stringify(newMode));
      return newMode;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      setLoading(true);
      await onSendMessage(inputText, mode); // 传递文本和模式，由父组件处理
      setInputText('');
      setLoading(false);
      // 不重置模式，保持用户选择
    }
  };

  return (
    <form className="input-area" onSubmit={handleSubmit}>
      <div className="input-actions">
        <button
          type="button"
          className={`action-btn${mode.deepthink ? ' active' : ''}`}
          onClick={() => handleModeChange('deepthink')}
          disabled={loading}
        >
          深度思考
        </button>
        <button
          type="button"
          className={`action-btn${mode.search ? ' active' : ''}`}
          onClick={() => handleModeChange('search')}
          disabled={loading}
        >
          联网搜索
        </button>
      </div>
      <input
        type="text"
        className="chat-input"
        placeholder="输入您的问题..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        disabled={loading}
      />
      <button type="submit" disabled={loading} className="chat-send-btn">
        {loading ? '发送中...' : '发送'}
      </button>
    </form>
  );
};

export default MessageInput;