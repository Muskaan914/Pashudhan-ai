import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, Bot } from 'lucide-react';

const INITIAL_MESSAGE = {
  id: 1,
  text: "नमस्ते! मैं आपका पशुधन सहायक हूँ। मैं आपकी कैसे मदद कर सकता हूँ? (Hello! I am your Pashudhan Assistant. How can I help you today?)",
  sender: 'bot'
};

const ChatbotHelper = () => {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput]       = useState('');
  const bottomRef               = useRef();

  // Load saved chat history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("chatHistory");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) setMessages(parsed);
      }
    } catch (e) {}
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function saveHistory(msgs) {
    try {
      localStorage.setItem("chatHistory", JSON.stringify(msgs));
    } catch (e) {}
  }

  const handleSend = () => {
    if (!input.trim()) return;

    const newMsg = { id: Date.now(), text: input, sender: 'user' };
    const updated = [...messages, newMsg];
    setMessages(updated);
    saveHistory(updated);
    setInput('');

    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        text: "मुझे समझ आ गया। कृपया अपने पशु के बारे में अधिक जानकारी दें। (I understand. Please provide more details about your livestock.)",
        sender: 'bot'
      };
      const withBot = [...updated, botMsg];
      setMessages(withBot);
      saveHistory(withBot);
    }, 1000);
  };

  function handleClear() {
    setMessages([INITIAL_MESSAGE]);
    localStorage.removeItem("chatHistory");
  }

  return (
    <div className="chat-page" style={{ height: 'calc(100vh - 130px)', display: 'flex', flexDirection: 'column' }}>
      <header className="header" style={{ marginBottom: '8px', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p>Expert Advice</p>
          <h1>AI Veterinarian</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleClear}
            style={{ fontSize: '12px', color: '#888', background: 'transparent', border: '1px solid #ccc', borderRadius: '20px', padding: '4px 10px', cursor: 'pointer' }}
          >
            Clear chat
          </button>
          <Bot size={36} color="var(--color-primary)" />
        </div>
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
            {msg.sender === 'bot' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                <Bot size={18} />
              </div>
            )}
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
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0, marginTop: 'auto' }}>
        <button className="btn btn-secondary" style={{ padding: '12px', borderRadius: '50%', flexShrink: 0, width: '48px', height: '48px' }}>
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
        <button className="btn btn-primary" onClick={handleSend} style={{ padding: '12px', borderRadius: '50%', flexShrink: 0, width: '48px', height: '48px' }}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatbotHelper;