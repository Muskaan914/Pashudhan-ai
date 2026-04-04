// src/services/api.js
// Scan + Symptoms → Google Gemini API (FREE)
// Milk → Render backend

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
const BACKEND_URL = "https://pashudhan-ai-backend-2.onrender.com";

// ── 1. Breed Scan ──────────────────────────────────────────────────────────
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
          {
            inline_data: {
              mime_type: imageFile.type || "image/jpeg",
              data: base64,
            },
          },
          {
            text: 'You are a livestock expert. Look at this image carefully. Is it a COW or BUFFALO? Identify the exact breed. Common Indian breeds: Gir, Sahiwal, Murrah Buffalo, Surti Buffalo, Holstein Friesian, Jersey, Tharparkar, Kankrej, Ongole. Reply ONLY with valid JSON, no markdown, no extra text: {"breed": "exact breed name", "confidence": 90, "health_status": "Healthy", "health_details": "one sentence about coat and body condition"}',
          },
        ],
      }],
      generationConfig: { maxOutputTokens: 150, temperature: 0.1 },
    }),
  });

  const data = await res.json();

  try {
    const raw = data.candidates[0].content.parts[0].text
      .trim()
      .replace(/```json|```/g, "")
      .trim();
    
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    
    const result = JSON.parse(jsonMatch[0]);
    return {
      success: true,
      breed: result.breed || "Unknown",
      confidence: result.confidence || 85,
      health_status: result.health_status || "Healthy",
      health_details: result.health_details || "No visible issues detected.",
    };
  } catch (e) {
    console.error("Parse error:", e);
    return { success: false, error: "Could not analyze image. Try again." };
  }
}

// ── 2. Symptom Analysis ────────────────────────────────────────────────────
export async function analyzeSymptoms(symptomsText) {
  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `You are an expert AI veterinarian for Indian livestock (cattle, buffalo, goat).
A farmer says: "${symptomsText}"
Reply ONLY with valid JSON, no markdown:
{"possible_conditions": ["condition1", "condition2"], "severity": "mild", "immediate_actions": ["action1", "action2"], "medicines": ["medicine (dosage)"], "when_to_call_vet": "explanation", "prevention": "tip"}`,
        }],
      }],
      generationConfig: { maxOutputTokens: 500, temperature: 0.2 },
    }),
  });

  const data = await res.json();

  try {
    const raw = data.candidates[0].content.parts[0].text
      .trim().replace(/```json|```/g, "").trim();
    const result = JSON.parse(raw);
    return { success: true, ...result };
  } catch (e) {
    return { success: false, error: "Could not analyze symptoms. Try again." };
  }
}

// ── 3. Milk Tracking (Render backend) ─────────────────────────────────────
export async function addMilkEntry(liters) {
  const res = await fetch(`${BACKEND_URL}/api/milk/add/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ liters: parseFloat(liters) }),
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json();
}

export async function getWeeklyMilk() {
  const res = await fetch(`${BACKEND_URL}/api/milk/weekly/`);
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json();
}