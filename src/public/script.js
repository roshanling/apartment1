let chatMessages = [];

document.addEventListener('DOMContentLoaded', () => {
    const messagesContainer = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        messageDiv.textContent = content;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        try {
            // 禁用输入和发送按钮
            userInput.disabled = true;
            sendButton.disabled = true;

            // 添加用户消息到界面
            addMessage(message, true);
            
            // 发送请求到服务器
            const response = await fetch('http://localhost:8080/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [{
                        role: 'user',
                        content: message
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            // 显示AI回复
            if (data.choices && data.choices[0] && data.choices[0].message) {
                addMessage(data.choices[0].message.content);
            } else {
                throw new Error('无效的API响应格式');
            }

        } catch (error) {
            console.error('Error:', error);
            addMessage('抱歉，发生了错误：' + error.message);
        } finally {
            // 重置输入框状态
            userInput.value = '';
            userInput.disabled = false;
            sendButton.disabled = false;
            userInput.focus();
        }
    }

    // 事件监听器
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // 添加初始欢迎消息
    addMessage('你好！我是你的AI Life Coach。请告诉我你想聊些什么？');
});