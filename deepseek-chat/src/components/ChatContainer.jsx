import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ApiKeyModal from './ApiKeyModal';
import { ApiService } from '../services/deepseekApi';

const ChatContainer = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "您好！我是基于DeepSeek的AI助手。请问有什么可以帮您的？",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(true);

  useEffect(() => {
    // 页面加载时尝试从localStorage读取apiKey
    const cachedKey = localStorage.getItem('deepseek_api_key');
    if (cachedKey) {
      setApiKey(cachedKey);
      ApiService.setToken(cachedKey); // 自动设置令牌
      setShowApiKeyModal(false);
    } else {
      setShowApiKeyModal(true);
    }
  }, []);

  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

const handleApiKeySubmit = (key) => {
    setApiKey(key);
    localStorage.setItem('deepseek_api_key', key); // 持久化令牌
    ApiService.setToken(key); // 设置全局令牌
    setShowApiKeyModal(false);
  };

  return (
    <div className="container">
      <ApiKeyModal 
        isOpen={showApiKeyModal}
        onSubmit={handleApiKeySubmit}
      />
      
      <div className="header">
        <h1>DeepSeek聊天机器人</h1>
        <p>基于DeepSeek API的AI对话演示</p>
      </div>
      
      <MessageList messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatContainer;