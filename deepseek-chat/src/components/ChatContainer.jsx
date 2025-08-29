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

  // 优化：支持 mode 参数
  const handleSendMessage = async (text, mode = { deepthink: false, search: false }) => {
    // 先显示用户消息
    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date(),
      mode
    };
    setMessages(prev => [...prev, userMessage]);

    // 选择模型
    let model = 'deepseek-chat';
    if (mode.deepthink) {
      model = 'deepseek-reasoner';
    }

    // 流式AI回复
    const aiMessageId = Date.now() + 1;
    let aiText = '';
    let reasoningText = '';
    setMessages(prev => [
      ...prev,
      {
        id: aiMessageId,
        text: '',
        sender: 'ai',
        timestamp: new Date(),
        mode
      },
      // 独立插入 reasoning 气泡
      ...(mode.deepthink ? [{
        id: `${aiMessageId}_reasoning`,
        text: '',
        sender: 'ai',
        timestamp: new Date(),
        type: 'reasoning',
        parentId: aiMessageId,
        mode
      }] : [])
    ]);

    try {
      const reqMessages = [{ role: 'user', content: text }];
      await ApiService.chatWithModelSSE({
        model,
        messages: reqMessages,
        onMessage: (data) => {
          // 回复内容拼接
          if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
            aiText += data.choices[0].delta.content;
            setMessages(prev =>
              prev.map(msg =>
                msg.id === aiMessageId ? { ...msg, text: aiText } : msg
              )
            );
          }
          // reasoning_content 流式拼接到 reasoning 气泡
          if (
            mode.deepthink &&
            data.choices &&
            data.choices[0] &&
            data.choices[0].delta &&
            data.choices[0].delta.reasoning_content
          ) {
            reasoningText += data.choices[0].delta.reasoning_content;
            const reasoningId = aiMessageId + '_reasoning';
            setMessages(prev => {
              const idx = prev.findIndex(msg => msg.id === reasoningId);
              if (idx !== -1) {
                // 已存在，拼接内容
                const updated = [...prev];
                updated[idx] = { ...updated[idx], text: reasoningText };
                return updated;
              } else {
                // 不存在，插入新气泡
                return [
                  ...prev,
                  {
                    id: reasoningId,
                    text: reasoningText,
                    sender: 'ai',
                    timestamp: new Date(),
                    type: 'reasoning',
                    parentId: aiMessageId,
                    mode
                  }
                ];
              }
            });
          }
        }
      });
    } catch (error) {
      let errorMsg = '请求失败，请稍后重试';
      if (error && error.status && error.status == '401') {
        errorMsg = '令牌无效或已过期，请重新输入API Key';
        setShowApiKeyModal(true);
      }
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessageId
            ? { ...msg, text: errorMsg, error: true }
            : msg
        )
      );
    }
  };

  const handleApiKeySubmit = (key) => {
    setApiKey(key);
    localStorage.setItem('deepseek_api_key', key); // 持久化令牌
    ApiService.setToken(key); // 设置全局令牌
    setShowApiKeyModal(false);
  };

  const handleRetry = (message) => {
    // 如果当前是 AI 消息，找到它前面的用户消息
    if (message.sender === 'ai') {
      // 找到与该 AI 消息最近的用户消息
      const userMsg = messages.slice().reverse().find(
        m => m.sender === 'user' && m.mode && JSON.stringify(m.mode) === JSON.stringify(message.mode)
      );
      if (userMsg) {
        handleSendMessage(userMsg.text, userMsg.mode);
      }
    } else {
      // 如果是用户消息，直接重试
      handleSendMessage(message.text, message.mode || { deepthink: false, search: false });
    }
  };

  return (
    <div className="container chat-main">
      <ApiKeyModal 
        isOpen={showApiKeyModal}
        onSubmit={handleApiKeySubmit}
      />
      
      <div className="header chat-header">
        <h1>DeepSeek聊天机器人</h1>
        <p>基于DeepSeek API的AI对话演示</p>
      </div>
      
      <div className="chat-body">
        <MessageList messages={messages} onRetry={handleRetry} />
      </div>
      <div className="chat-footer">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatContainer;