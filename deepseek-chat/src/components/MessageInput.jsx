import React, { useState } from 'react';
import { ApiService } from '../services/deepseekApi'; // 导入API方法

const MessageInput = ({ onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      setLoading(true);
      try {
        // 构造消息格式
        const messages = [{ role: 'user', content: inputText }];
        // 调用API
        const res = await ApiService.chatWithModel({
          model: 'deepseek-chat', // 根据实际模型名称填写
          messages,
        });
        // 回传AI回复
        onSendMessage(res.choices[0].message.content);
      } catch (error) {
        onSendMessage('请求失败，请稍后重试');
      }
      setInputText('');
      setLoading(false);
    }
  };

  return (
    <form className="input-area" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="输入您的问题..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? '发送中...' : '发送'}
      </button>
    </form>
  );
};

export default MessageInput;