// src/services/api.js
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;   // ← Gemini key in Vercel
const GROQ_KEY   = import.meta.env.VITE_GROQ_API_KEY;     // ← Groq key in Vercel

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;
const GROQ_URL   = "https://api.groq.com/openai/v1/chat/completions";

// ── 1. Breed Scan (Gemini Vision) ──────────────────────────────────────────
export async function scanAnimal(imageFile) {
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [
          { inline_data: { mime_type: imageFile.type || "image/jpeg", data: base64 } },
          { text: 'You are a livestock expert. Identify this animal breed. Common Indian breeds: Gir, Sahiwal, Murrah Buffalo, Surti Buffalo, Holstein Friesian, Jersey, Tharparkar, Kankrej, Ongole. Reply ONLY with valid JSON: {"breed": "exact breed name", "confidence": 90, "health_status": "Healthy", "health_details": "one sentence about coat and body condition"}' },
        ],
      }],
      generationConfig: { maxOutputTokens: 150, temperature: 0.1 },
    }),
  });

  const data = await res.json();
  try {
    const raw = data.candidates[0].content.parts[0].text.trim().replace(/```json|```/g, "").trim();
    const result = JSON.parse(raw);
    return {
      success:        true,
      breed:          result.breed          || "Unknown",
      confidence:     result.confidence     || 85,
      health_status:  result.health_status  || "Healthy",
      health_details: result.health_details || "No visible issues.",
    };
  } catch {
    if (data.error?.code === 429) return { success: false, error: "Too many requests. Wait 30 seconds and try again." };
    return { success: false, error: "Could not analyze image. Try again." };
  }
}

// ── 2. Symptom Analysis (Groq — fast & free) ──────────────────────────────
export async function analyzeSymptoms(symptomsText) {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: `You are an expert AI veterinarian for Indian livestock (cattle, buffalo, goat). 
Reply ONLY with valid JSON, no markdown:
{"possible_conditions": ["condition1", "condition2"], "severity": "mild or moderate or severe", "immediate_actions": ["action1", "action2"], "medicines": ["medicine (dosage)"], "when_to_call_vet": "explanation", "prevention": "tip"}`,
        },
        {
          role: "user",
          content: `Farmer says: ${symptomsText}`,
        },
      ],
      max_tokens: 500,
      temperature: 0.2,
    }),
  });

  const data = await res.json();
  try {
    const raw = data.choices[0].message.content.trim().replace(/```json|```/g, "").trim();
    return { success: true, ...JSON.parse(raw) };
  } catch {
    return { success: false, error: "Could not analyze symptoms. Try again." };
  }
}

// ── 3. Milk Tracking (localStorage) ───────────────────────────────────────
export async function addMilkEntry(liters) {
  const today = new Date().toISOString().split("T")[0];
  const data  = JSON.parse(localStorage.getItem("milk_data") || "{}");
  data[today] = parseFloat(liters);
  localStorage.setItem("milk_data", JSON.stringify(data));
  return { success: true, date: today, liters: parseFloat(liters) };
}

export async function getWeeklyMilk() {
  const data  = JSON.parse(localStorage.getItem("milk_data") || "{}");
  const today = new Date();
  const weekly = [];
  const days  = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    weekly.push({ date: dateStr, day: days[d.getDay()], liters: data[dateStr] || 0 });
  }

  const cutoff   = new Date(today.getTime() - 30*24*60*60*1000).toISOString().split("T")[0];
  const last30   = Object.keys(data).filter(k => k >= cutoff).map(k => data[k]);
  const monthly_average = last30.length
    ? Math.round(last30.reduce((a, b) => a + b, 0) / last30.length * 10) / 10
    : 0;

  return { success: true, weekly, monthly_average };
}