import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, Bot } from 'lucide-react';

const INITIAL_MESSAGE = {
  id: 1,
  text: "नमस्ते! 🙏 I'm your AI Veterinarian.\n\nI can help you with:\n• 🐄 Cattle & buffalo health problems\n• 💊 Medicine and treatment advice\n• 🌾 Feed and nutrition guidance\n• 📅 Vaccination schedules\n• 🏥 When to call a vet\n\nJust talk to me naturally!",
  sender: 'bot'
};

const SYSTEM_PROMPT = `You are an expert AI Veterinarian assistant for Pashudhan AI, an Indian livestock management app. You specialize in cattle and buffalo health, breeds, diseases, treatment, nutrition, and farming in India. Be friendly, helpful and conversational like a real vet doctor talking to an Indian farmer. Use emojis. Keep answers practical and concise. If serious, recommend a local vet.`;

const HF_TOKEN = import.meta.env.VITE_HF_TOKEN || "";

const ChatbotHelper = () => {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("chatHistory2");
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
      localStorage.setItem("chatHistory2", JSON.stringify({ msgs, history }));
    } catch (e) {}
  }

  async function callFreeAI(userText, history) {
    // Build conversation for the model
    const historyText = history.slice(-6).map(m =>
      m.role === 'user' ? `User: ${m.content}` : `Assistant: ${m.content}`
    ).join('\n');

    const prompt = `${SYSTEM_PROMPT}\n\n${historyText}\nUser: ${userText}\nAssistant:`;

    // Use HF free inference - Mistral 7B
    const res = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(HF_TOKEN ? { Authorization: `Bearer ${HF_TOKEN}` } : {}),
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.7,
            return_full_text: false,
            stop: ["User:", "\nUser"],
          },
        }),
      }
    );

    if (!res.ok) throw new Error("API error " + res.status);
    const data = await res.json();

    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text.split("User:")[0].trim();
    }
    if (data.error) throw new Error(data.error);
    throw new Error("No response");
  }

  const handleSend = async () => {
    if (!input.trim() || typing) return;

    const userText = input.trim();
    const userMsg = { id: Date.now(), text: userText, sender: 'user' };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setTyping(true);

    const newHistory = [...conversationHistory, { role: 'user', content: userText }];

    try {
      const aiText = await callFreeAI(userText, conversationHistory);
      const botMsg = { id: Date.now() + 1, text: aiText, sender: 'bot' };
      const finalMsgs = [...newMsgs, botMsg];
      const finalHistory = [...newHistory, { role: 'assistant', content: aiText }];
      setMessages(finalMsgs);
      setConversationHistory(finalHistory);
      saveHistory(finalMsgs, finalHistory);
    } catch (e) {
      // Fallback to local smart responses if HF is down
      const fallback = getLocalResponse(userText);
      const botMsg = { id: Date.now() + 1, text: fallback, sender: 'bot' };
      const finalMsgs = [...newMsgs, botMsg];
      setMessages(finalMsgs);
      saveHistory(finalMsgs, newHistory);
    } finally {
      setTyping(false);
    }
  };

  function getLocalResponse(text) {
    const t = text.toLowerCase();
    if (t.includes('fever') || t.includes('bukhar') || t.includes('बुखार'))
      return "🌡️ For fever in cattle:\n\n• Move animal to cool shaded area\n• Provide cold fresh water\n• Sponge body with cold water\n• Give Paracetamol injection 15mg/kg\n\n🏥 If fever exceeds 104°F or persists 48hrs, call your vet immediately.";
    if (t.includes('not eating') || t.includes('nahi kha') || t.includes('appetite'))
      return "🍃 If your animal is not eating:\n\n• Check for bloating (press left flank)\n• Give 500ml liquid paraffin oil orally\n• Walk animal slowly 10-15 mins\n• Offer fresh green fodder\n\n💊 Digyton plus 30ml orally can help. Call vet if not eating for 24+ hours.";
    if (t.includes('milk') || t.includes('doodh') || t.includes('दूध'))
      return "🥛 For low milk production:\n\n• Check udder for mastitis (redness/swelling)\n• Ensure animal gets 60L+ water daily\n• Add mineral supplements to feed\n• Maintain regular milking schedule\n\n💊 Vitamin E + Selenium injection can boost production.";
    if (t.includes('limp') || t.includes('leg') || t.includes('khur') || t.includes('foot'))
      return "🦶 For limping/foot problems:\n\n• Examine hoof for stones or wounds\n• Clean with antiseptic solution\n• Apply copper sulfate foot bath\n• Provide soft dry bedding\n\n💊 Penicillin injection if infection suspected. Call vet if can't bear weight.";
    if (t.includes('pregnant') || t.includes('gabhaan') || t.includes('delivery'))
      return "🐄 For pregnant cattle:\n\n• Provide extra nutrition in last 3 months\n• Give Calcium + Phosphorus supplements\n• Keep in clean dry area\n• Watch for signs of labor (restlessness, udder swelling)\n\n🏥 Have your vet's number ready for delivery assistance.";
    if (t.includes('vaccine') || t.includes('vaccination') || t.includes('टीका'))
      return "💉 Indian Cattle Vaccination Schedule:\n\n• FMD vaccine — every 6 months\n• BQ (Black Quarter) — annually\n• HS (Hemorrhagic Septicemia) — annually\n• Brucellosis — once for heifers\n• LSD (Lumpy Skin) — annually\n\n📅 Contact your nearest veterinary center for free government vaccination camps!";
    if (t.includes('hello') || t.includes('hi') || t.includes('namaste') || t.includes('नमस्ते'))
      return "नमस्ते! 🙏 How can I help you today? Tell me about your cattle or buffalo — any health issue, feeding question, or anything else!";
    return "🐄 I understand you need help with your livestock. Could you tell me more details?\n\nFor example:\n• What animal? (cow, buffalo, calf)\n• What symptoms are you seeing?\n• How long has this been happening?\n\nI'll give you the best advice I can! 🙏";
  }

  function handleClear() {
    setMessages([INITIAL_MESSAGE]);
    setConversationHistory([]);
    localStorage.removeItem("chatHistory2");
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
          <div key={msg.id} style={{ display: 'flex', gap: '8px', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
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
            <div style={{ background: 'var(--color-surface)', padding: '12px 16px', borderRadius: '16px 16px 16px 0', boxShadow: 'var(--shadow-sm)', color: '#888', fontStyle: 'italic' }}>
              Thinking... 🤔
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
          placeholder="Ask anything about your livestock..."
          style={{ flex: 1, padding: '12px 16px', borderRadius: 'var(--radius-full)', border: '1px solid #ccc', fontSize: '1rem' }}
        />
        <button
          className="btn btn-primary"
          onClick={handleSend}
          disabled={typing}
          style={{ padding: '12px', borderRadius: '50%', flexShrink: 0, width: '48px', height: '48px', opacity: typing ? 0.6 : 1 }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatbotHelper;