const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const BACKEND_URL = "https://pashudhan-ai-backend-2.onrender.com";

export async function scanAnimal(imageFile) {
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: imageFile.type || "image/jpeg", data: base64 },
          },
          {
            type: "text",
            text: 'You are a livestock expert. Is it a COW or BUFFALO? Identify exact breed. Common Indian breeds: Gir, Sahiwal, Murrah Buffalo, Holstein Friesian, Jersey, Tharparkar. Reply ONLY valid JSON: {"breed": "exact breed name", "confidence": 90, "health_status": "Healthy", "health_details": "one sentence"}',
          },
        ],
      }],
    }),
  });

  const data = await res.json();
  const raw = data.content[0].text.trim().replace(/```json|```/g, "").trim();
  try {
    const result = JSON.parse(raw);
    return { success: true, breed: result.breed || "Unknown", confidence: result.confidence || 85, health_status: result.health_status || "Healthy", health_details: result.health_details || "No issues." };
  } catch {
    return { success: true, breed: "Unknown", confidence: 0, health_status: "Unknown", health_details: raw };
  }
}

export async function analyzeSymptoms(symptomsText) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system: `You are an expert AI veterinarian for Indian livestock. Reply ONLY with JSON: {"possible_conditions": ["condition1"], "severity": "mild or moderate or severe", "immediate_actions": ["action1"], "medicines": ["medicine"], "when_to_call_vet": "explanation", "prevention": "tip"}`,
      messages: [{ role: "user", content: `Symptoms: ${symptomsText}` }],
    }),
  });

  const data = await res.json();
  const raw = data.content[0].text.trim().replace(/```json|```/g, "").trim();
  try {
    return { success: true, ...JSON.parse(raw) };
  } catch {
    return { success: false, error: raw };
  }
}

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