import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, Bot } from 'lucide-react';
import { analyzeSymptoms } from '../services/api';

const INITIAL_MESSAGE = {
  id: 1,
  text: "नमस्ते! मैं आपका पशुधन सहायक हूँ। अपने पशु की समस्या बताएं जैसे: 'मेरी गाय को बुखार है' या 'buffalo not eating'. (Hello! Tell me your livestock problem e.g. 'my cow has fever' or 'buffalo limping')",
  sender: 'bot'
};

const ChatbotHelper = () => {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput]       = useState('');
  const [typing, setTyping]     = useState(false);
  const bottomRef               = useRef();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("chatHistory");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) setMessages(parsed);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  function saveHistory(msgs) {
    try {
      localStorage.setItem("chatHistory", JSON.stringify(msgs));
    } catch (e) {}
  }

  function formatAnalysis(data) {
    let text = '';
    if (data.possible_conditions?.length) {
      text += `🔍 Possible conditions: ${data.possible_conditions.join(', ')}\n\n`;
    }
    if (data.severity) {
      const emoji = data.severity === 'severe' ? '🔴' : data.severity === 'moderate' ? '🟡' : '🟢';
      text += `${emoji} Severity: ${data.severity.toUpperCase()}\n\n`;
    }
    if (data.immediate_actions?.length) {
      text += `⚡ Immediate actions:\n${data.immediate_actions.map(a => `• ${a}`).join('\n')}\n\n`;
    }
    if (data.medicines?.length) {
      text += `💊 Medicines: ${data.medicines.join(', ')}\n\n`;
    }
    if (data.when_to_call_vet) {
      text += `🏥 Vet advice: ${data.when_to_call_vet}`;
    }
    return text.trim();
  }

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    const updated = [...messages, userMsg];
    setMessages(updated);
    saveHistory(updated);
    setInput('');
    setTyping(true);

    try {
      const data = await analyzeSymptoms(input);
      const botText = data.success
        ? formatAnalysis(data)
        : "Sorry, I couldn't analyze that. Please describe the symptoms more clearly.";

      const botMsg = { id: Date.now() + 1, text: botText, sender: 'bot' };
      const withBot = [...updated, botMsg];
      setMessages(withBot);
      saveHistory(withBot);
    } catch (e) {
      const errMsg = { id: Date.now() + 1, text: "Network error. Please try again.", sender: 'bot' };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setTyping(false);
    }
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
          <button onClick={handleClear} style={{ fontSize: '12px', color: '#888', background: 'transparent', border: '1px solid #ccc', borderRadius: '20px', padding: '4px 10px', cursor: 'pointer' }}>
            Clear chat
          </button>
          <Bot size={36} color="var(--color-primary)" />
        </div>
      </header>

      <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '20px' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', gap: '8px', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
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
              fontSize: '0.9rem',
              whiteSpace: 'pre-line',
              lineHeight: '1.6'
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {typing && (
          <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <Bot size={18} />
            </div>
            <div style={{ background: 'var(--color-surface)', padding: '12px 16px', borderRadius: '16px 16px 16px 0', boxShadow: 'var(--shadow-sm)' }}>
              🔍 Analyzing symptoms...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: 'flex', gap: '8px', flexShrink: 0, marginTop: 'auto' }}>
        <button className="btn btn-secondary" style={{ padding: '12px', borderRadius: '50%', flexShrink: 0, width: '48px', height: '48px' }}>
          <Mic size={20} color="var(--color-primary-dark)" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Describe symptoms... e.g. cow has fever"
          style={{ flex: 1, padding: '12px 16px', borderRadius: 'var(--radius-full)', border: '1px solid #ccc', fontSize: '1rem' }}
        />
        <button className="btn btn-primary" onClick={handleSend} disabled={typing} style={{ padding: '12px', borderRadius: '50%', flexShrink: 0, width: '48px', height: '48px' }}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatbotHelper;