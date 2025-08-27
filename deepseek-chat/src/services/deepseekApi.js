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
