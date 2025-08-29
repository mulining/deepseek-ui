import axios from "axios";

// Use import.meta.env for Vite or process.env for Create React App
// 获取 .env 文件中的 API Key
// eslint-disable-next-line no-undef

export class ApiService {
  static BASE_URL = "https://api.deepseek.com/v1"; // 请根据实际 API 地址修改

  /** 设置令牌（只需调用一次即可全局生效） */
  static setToken(token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  // 聊天接口
  static async chatWithModel({ model, messages, temperature = 0.7 }) {
    const response = await axios.post(`${this.BASE_URL}/chat/completions`, {
      model,
      messages,
      temperature,
    });
    return response.data;
  }

  static async chatWithModelSSE({ model, messages, temperature = 0.7, onMessage }) {
    const url = `${this.BASE_URL}/chat/completions`;
    const token = axios.defaults.headers.common["Authorization"];
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        stream: true
      })
    });
    if (!response.ok) {
      throw response 
    }

    if (!response.body) throw new Error('SSE not supported');

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      // 按行分割处理 SSE 数据
      const lines = buffer.split('\n');
      buffer = lines.pop(); // 保留未处理的部分
      for (const line of lines) {
        if (line.startsWith('data:')) {
          const data = line.replace('data:', '').trim();
          if (data === '[DONE]') return;
          try {
            const json = JSON.parse(data);
            onMessage && onMessage(json);
          } catch (err) {
            // Optionally log or handle the error
            console.error('JSON parse error in SSE:', err);
          }
        }
      }
    }
  }

  // 获取模型列表
  static async fetchModels() {
    const response = await axios.get(`${this.BASE_URL}/models`);
    return response.data;
  }

  // 获取模型详情
  static async fetchModelDetail(modelId) {
    const response = await axios.get(`${this.BASE_URL}/models/${modelId}`);
    return response.data;
  }

  /**
   * 查询余额
   */
  static async fetchBalance() {
    const response = await axios.get(`${this.BASE_URL}/user/balance`);
    return response.data;
  }
}

// 其他接口可按需补充...
