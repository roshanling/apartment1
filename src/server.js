const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API配置
const API_KEY = '24458557-858a-48c8-824c-de91f8b53f1b';
const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

// 处理聊天请求的路由
app.post('/chat', async (req, res) => {
  try {
    console.log('发送请求到 API...');
    console.log('请求数据:', req.body.messages);
    
    const response = await axios({
      method: 'post',
      url: API_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      data: {
        model: 'deepseek-r1-250120',
        messages: [
          {
            role: 'system',
            content: '你是一位专业的life coach，你的目标是通过对话帮助用户成长。你应该倾听用户的问题，给出专业的建议和指导。'
          },
          ...req.body.messages
        ],
        temperature: 0.6,
        stream: false
      },
      timeout: 60000
    });
    
    console.log('收到 API 响应');
    console.log('响应数据:', response.data);
    
    res.json(response.data);

  } catch (error) {
    console.error('详细错误信息:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    
    res.status(500).json({
      error: '服务器错误，请稍后重试',
      details: error.message
    });
  }
});

const PORT = 8080;  // 修改为8080端口
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});