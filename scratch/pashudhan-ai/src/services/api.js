// src/services/api.js
// Scan (Roboflow) + Health Analysis (Gemini) + Symptoms (Gemini) → APIs
// Milk → Render backend

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ROBOFLOW_API_KEY = import.meta.env.VITE_ROBOFLOW_API_KEY;
const ROBOFLOW_PROJECT = "cattle-breed-detection";
const ROBOFLOW_VERSION = "1";

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
const ROBOFLOW_URL = `https://detect.roboflow.com/${ROBOFLOW_PROJECT}/${ROBOFLOW_VERSION}`;
const BACKEND_URL = "https://pashudhan-ai-backend-2.onrender.com";

// ── 1. Breed Scan (Roboflow + Gemini Health Analysis) ──────────────────────
export async function scanAnimal(imageFile) {
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });

  let breedResult = null;
  let healthResult = null;

  // Step 1: Try Roboflow for breed detection (specialized livestock model)
  if (ROBOFLOW_API_KEY) {
    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("api_key", ROBOFLOW_API_KEY);

      const roboRes = await fetch(ROBOFLOW_URL, {
        method: "POST",
        body: formData,
      });

      if (roboRes.ok) {
        const roboData = await roboRes.json();
        if (roboData.predictions && roboData.predictions.length > 0) {
          const prediction = roboData.predictions[0];
          breedResult = {
            breed: prediction.class || "Unknown Cattle Breed",
            confidence: Math.round(prediction.confidence * 100),
            source: "Roboflow Specialized Model",
          };
        }
      }
    } catch (e) {
      console.warn("Roboflow API error, falling back to Gemini:", e);
    }
  }

  // Step 2: Use Gemini for health analysis and as fallback for breed
  const geminiPrompt = breedResult
    ? `Analyze this livestock image for health indicators. The detected breed is ${breedResult.breed}. Provide a JSON response: {"health_status": "Healthy/Concerning/Sick", "health_details": "2-3 sentences about coat condition, body score, visible signs", "observations": "any visible health concerns"}`
    : `You are a livestock expert specializing in Indian cattle and buffalo breeds. Analyze this image and provide JSON: {"breed": "exact breed name from: Gir, Sahiwal, Murrah Buffalo, Surti Buffalo, Holstein Friesian, Jersey, Tharparkar, Kankrej, Ongole, etc.", "confidence": 85, "health_status": "Healthy/Concerning/Sick", "health_details": "2-3 sentences about visible health indicators"}`;

  try {
    const geminiRes = await fetch(GEMINI_URL, {
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
              text: geminiPrompt + ". Reply ONLY with valid JSON, no markdown, no extra text.",
            },
          ],
        }],
        generationConfig: { maxOutputTokens: 200, temperature: 0.2 },
      }),
    });

    const geminiData = await geminiRes.json();
    const raw = geminiData.candidates[0].content.parts[0].text
      .trim()
      .replace(/```json|```/g, "")
      .trim();

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      healthResult = JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error("Gemini analysis error:", e);
  }

  // Combine results
  const finalBreed = breedResult?.breed || healthResult?.breed || "Unknown";
  const finalConfidence = breedResult?.confidence || healthResult?.confidence || 75;
  const healthStatus = healthResult?.health_status || "Unknown";
  const healthDetails = healthResult?.health_details || healthResult?.observations || "Could not fully analyze. Please consult a veterinarian.";

  return {
    success: true,
    breed: finalBreed,
    confidence: finalConfidence,
    health_status: healthStatus,
    health_details: healthDetails,
    detection_source: breedResult?.source || "Gemini Vision Analysis",
  };
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
