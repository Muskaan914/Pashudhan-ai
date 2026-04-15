import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, Bot, Trash2 } from 'lucide-react';

const INITIAL_MESSAGE = {
  id: 1,
  text: "नमस्ते! 🙏 I'm your AI Veterinarian.\n\nI can help you with:\n• 🐄 Cattle & buffalo breeds & info\n• 🌾 Feed and nutrition guidance\n• 💊 Medicine and treatment advice\n• 📅 Vaccination schedules\n• 🤱 Pregnancy & calving advice\n• 🏥 When to call a vet\n\nJust talk to me naturally — Hindi or English, both work!",
  sender: 'bot'
};

const SYSTEM_PROMPT = `You are an expert AI Veterinarian assistant for Pashudhan AI, an Indian livestock management app. You specialize in:
- Cattle and buffalo breeds (Gir, Murrah, HF, Jersey, Sahiwal, etc.)
- Animal diseases, symptoms, and treatment
- Feed, nutrition, and fodder guidance for Indian conditions
- Vaccination schedules as per Indian government norms
- Pregnancy, calving, and newborn calf care
- Milk production improvement
- Government schemes for livestock farmers (PM Kisan, NABARD loans, etc.)
- Market price guidance for milk and animals

Tone: Friendly, warm, and conversational — like a trusted village vet talking to an Indian farmer. Use emojis naturally. Support both Hindi and English queries. Keep answers practical, concise, and actionable. For serious conditions, always recommend calling a local vet. Never give the same generic fallback — always answer the actual question asked.`;

const ChatbotHelper = () => {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("chatHistory_pashudhan");
      if (saved) {
        const { msgs, history } = JSON.parse(saved);
        if (msgs?.length > 0) setMessages(msgs);
        if (history?.length > 0) setConversationHistory(history);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  function saveHistory(msgs, history) {
    try {
      localStorage.setItem("chatHistory_pashudhan", JSON.stringify({ msgs, history }));
    } catch (e) {}
  }

  async function callAnthropicAPI(userText, history) {
    // Build messages array with full conversation history
    const apiMessages = [
      ...history.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: userText }
    ];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: apiMessages,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `API error ${response.status}`);
    }

    const data = await response.json();
    const text = data.content
      ?.filter(block => block.type === 'text')
      .map(block => block.text)
      .join('');

    if (!text) throw new Error("Empty response from API");
    return text;
  }

  const handleSend = async () => {
    if (!input.trim() || typing) return;

    const userText = input.trim();
    const userMsg = { id: Date.now(), text: userText, sender: 'user' };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setTyping(true);

    const updatedHistory = [...conversationHistory, { role: 'user', content: userText }];

    try {
      const aiText = await callAnthropicAPI(userText, conversationHistory);
      const botMsg = { id: Date.now() + 1, text: aiText, sender: 'bot' };
      const finalMsgs = [...newMsgs, botMsg];
      const finalHistory = [...updatedHistory, { role: 'assistant', content: aiText }];
      setMessages(finalMsgs);
      setConversationHistory(finalHistory);
      saveHistory(finalMsgs, finalHistory);
    } catch (e) {
      console.error("Anthropic API error:", e);
      const errMsg = {
        id: Date.now() + 1,
        text: "⚠️ Sorry, I'm having trouble connecting right now. Please check your internet connection and try again in a moment. 🙏",
        sender: 'bot',
        isError: true,
      };
      setMessages([...newMsgs, errMsg]);
    } finally {
      setTyping(false);
    }
  };

  function handleClear() {
    setMessages([INITIAL_MESSAGE]);
    setConversationHistory([]);
    localStorage.removeItem("chatHistory_pashudhan");
  }

  // Quick suggestion chips shown only when no conversation yet
  const suggestions = [
    "Tell me about Murrah buffalo 🐃",
    "Vaccination schedule for cattle 💉",
    "My cow has fever 🌡️",
    "Feed for pregnant cow 🤱",
  ];

  const showSuggestions = messages.length === 1; // Only initial message shown

  return (
    <div
      className="chat-page"
      style={{
        height: 'calc(100vh - 130px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header
        className="header"
        style={{
          marginBottom: '8px',
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <p>Expert Advice</p>
          <h1>AI Veterinarian</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleClear}
            title="Clear chat"
            style={{
              fontSize: '12px',
              color: '#888',
              background: 'transparent',
              border: '1px solid #ccc',
              borderRadius: '20px',
              padding: '4px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Trash2 size={12} />
            Clear
          </button>
          <Bot size={36} color="var(--color-primary)" />
        </div>
      </header>

      {/* Messages */}
      <div
        className="chat-messages"
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          paddingBottom: '20px',
        }}
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              gap: '8px',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '88%',
            }}
          >
            {msg.sender === 'bot' && (
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: msg.isError
                    ? '#f87171'
                    : 'var(--color-primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  flexShrink: 0,
                }}
              >
                <Bot size={18} />
              </div>
            )}
            <div
              style={{
                background: msg.sender === 'user'
                  ? 'var(--color-primary)'
                  : msg.isError
                    ? '#fef2f2'
                    : 'var(--color-surface)',
                color: msg.sender === 'user'
                  ? '#fff'
                  : msg.isError
                    ? '#b91c1c'
                    : 'var(--color-text-main)',
                padding: '12px 16px',
                borderRadius: msg.sender === 'user'
                  ? '16px 16px 0 16px'
                  : '16px 16px 16px 0',
                boxShadow: 'var(--shadow-sm)',
                fontSize: '0.9rem',
                whiteSpace: 'pre-line',
                lineHeight: '1.6',
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--color-primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                flexShrink: 0,
              }}
            >
              <Bot size={18} />
            </div>
            <div
              style={{
                background: 'var(--color-surface)',
                padding: '12px 16px',
                borderRadius: '16px 16px 16px 0',
                boxShadow: 'var(--shadow-sm)',
                color: '#888',
                fontStyle: 'italic',
              }}
            >
              Thinking... 🤔
            </div>
          </div>
        )}

        {/* Quick suggestion chips */}
        {showSuggestions && !typing && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              padding: '4px 0',
              alignSelf: 'flex-start',
              maxWidth: '100%',
            }}
          >
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(s);
                  setTimeout(() => {
                    // auto-send
                    setInput('');
                    const userMsg = { id: Date.now() + i, text: s, sender: 'user' };
                    const newMsgs = [...messages, userMsg];
                    setMessages(newMsgs);
                    setTyping(true);
                    callAnthropicAPI(s, conversationHistory)
                      .then(aiText => {
                        const botMsg = { id: Date.now() + 99, text: aiText, sender: 'bot' };
                        const finalMsgs = [...newMsgs, botMsg];
                        const finalHistory = [
                          ...conversationHistory,
                          { role: 'user', content: s },
                          { role: 'assistant', content: aiText },
                        ];
                        setMessages(finalMsgs);
                        setConversationHistory(finalHistory);
                        saveHistory(finalMsgs, finalHistory);
                      })
                      .catch(() => {
                        setMessages([...newMsgs, {
                          id: Date.now() + 100,
                          text: "⚠️ Connection error. Please try again.",
                          sender: 'bot',
                          isError: true,
                        }]);
                      })
                      .finally(() => setTyping(false));
                  }, 0);
                }}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-primary)',
                  color: 'var(--color-primary)',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  whiteSpace: 'nowrap',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexShrink: 0,
          marginTop: 'auto',
        }}
      >
        <button
          className="btn btn-secondary"
          style={{
            padding: '12px',
            borderRadius: '50%',
            flexShrink: 0,
            width: '48px',
            height: '48px',
          }}
        >
          <Mic size={20} color="var(--color-primary-dark)" />
        </button>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything about your livestock..."
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid #ccc',
            fontSize: '1rem',
          }}
        />
        <button
          className="btn btn-primary"
          onClick={handleSend}
          disabled={typing || !input.trim()}
          style={{
            padding: '12px',
            borderRadius: '50%',
            flexShrink: 0,
            width: '48px',
            height: '48px',
            opacity: typing || !input.trim() ? 0.6 : 1,
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatbotHelper;