import React, { useState } from 'react';
import { Send, Mic, User, Bot } from 'lucide-react';

const ChatbotHelper = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "नमस्ते! मैं आपका पशुधन सहायक हूँ। मैं आपकी कैसे मदद कर सकता हूँ? (Hello! I am your Pashudhan Assistant. How can I help you today?)", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages([...messages, newMsg]);
    setInput('');
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "मुझे समझ आ गया। कृपया अपने पशु के बारे में अधिक जानकारी दें। (I understand. Please provide more details about your livestock.)",
        sender: 'bot'
      }]);
    }, 1000);
  };

  return (
    <div className="chat-page" style={{ height: 'calc(100vh - 130px)', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ marginBottom: '16px', flexShrink: 0 }}>
        <div>
          <p>Expert Advice</p>
          <h1>AI Veterinarian</h1>
        </div>
        <Bot size={36} color="var(--color-primary)" />
      </header>

      {/* Chat Messages */}
      <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '20px' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ 
            display: 'flex', 
            gap: '8px', 
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%'
          }}>
            {msg.sender === 'bot' && <div style={{width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'}}><Bot size={18}/></div>}
            <div style={{
              background: msg.sender === 'user' ? 'var(--color-primary)' : 'var(--color-surface)',
              color: msg.sender === 'user' ? '#fff' : 'var(--color-text-main)',
              padding: '12px 16px',
              borderRadius: msg.sender === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
              boxShadow: 'var(--shadow-sm)',
              fontSize: '0.95rem'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0, marginTop: 'auto' }}>
        <button className="btn btn-secondary" style={{padding: '12px', borderRadius: '50%', flexShrink: 0, width: '48px', height: '48px'}}>
          <Mic size={20} color="var(--color-primary-dark)" />
        </button>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask something... / कुछ पूछें..."
          style={{ flex: 1, padding: '12px 16px', borderRadius: 'var(--radius-full)', border: '1px solid #ccc', fontSize: '1rem' }}
        />
        <button className="btn btn-primary" onClick={handleSend} style={{padding: '12px', borderRadius: '50%', flexShrink: 0, width: '48px', height: '48px'}}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatbotHelper;
