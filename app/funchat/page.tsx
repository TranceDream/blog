'use client';

import { useState } from 'react';

export default function ChatRoom() {
  const [messages, setMessages] = useState([
    { from: 'other', text: '你好，很高兴见到你！' },
    { from: 'user', text: '我也很高兴见到你！' },
  ]);
  const [inputValue, setInputValue] = useState('');

  const sendMessage = () => {
    const messageText = inputValue.trim();
    if (messageText === '') {
      alert('消息不能为空！');
      return;
    }

    // 添加用户消息
    setMessages(prevMessages => [...prevMessages, { from: 'user', text: messageText }]);
    setInputValue('');

    // 模拟对方回复
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { from: 'other', text: '这是一条自动回复的消息！' }]);
    }, 1000);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div style={{ margin: 0, fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', display: 'flex', height: '82vh' }}>
      {/* 左侧联系人列表 */}
      <div className="sidebar" style={{
        width: '250px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #ddd',
        overflowY: 'auto',
        padding: '10px'
      }}>
        <h2 style={{ fontSize: '16px', color: '#333', marginBottom: '10px' }}>联系人</h2>
        <div className="contact" style={contactStyle}>
          <img src="https://via.placeholder.com/40" alt="avatar" style={avatarStyle} />
          <div>用户1</div>
        </div>
        <div className="contact" style={contactStyle}>
          <img src="https://via.placeholder.com/40" alt="avatar" style={avatarStyle} />
          <div>用户2</div>
        </div>
        <div className="contact" style={contactStyle}>
          <img src="https://via.placeholder.com/40" alt="avatar" style={avatarStyle} />
          <div>用户3</div>
        </div>
      </div>

      {/* 右侧聊天窗口 */}
      <div className="chat-window" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="chat-header" style={{
          backgroundColor: '#0078d7',
          color: 'white',
          padding: '10px',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <img src="https://via.placeholder.com/30" alt="avatar" style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }} />
          <div>函钩网聊天室</div>
        </div>

        <div className="chat-body" style={{
          flex: 1,
          backgroundColor: '#ffffff',
          padding: '10px',
          overflowY: 'auto',
          borderBottom: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.from}`}
              style={msg.from === 'user' ? userMessageStyle : otherMessageStyle}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="chat-input" style={{ display: 'flex', padding: '10px', backgroundColor: '#ffffff' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息..."
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              marginRight: '10px'
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              backgroundColor: '#0078d7',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}

const contactStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
  borderBottom: '1px solid #ddd',
  cursor: 'pointer',
  color: 'black'
};

const avatarStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  marginRight: '10px'
};

const userMessageStyle = {
  backgroundColor: '#0078d7',
  color: 'white',
  maxWidth: '70%',
  padding: '10px',
  borderRadius: '5px',
  margin: '10px 0',
  marginRight: '20px',
  alignSelf: 'flex-end'
};

const otherMessageStyle = {
  backgroundColor: '#f0f0f0',
  color: '#333',
  maxWidth: '70%',
  padding: '10px',
  borderRadius: '5px',
  margin: '10px 0',
  alignSelf: 'flex-start'
};
