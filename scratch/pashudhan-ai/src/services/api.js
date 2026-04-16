// api/analyze-symptoms.js  ← place this file at the ROOT of your project in /api/
// Vercel will auto-deploy it as a serverless function at /api/analyze-symptoms
// Your ANTHROPIC_API_KEY stays safe on the server — never exposed to the browser.

const SYSTEM_PROMPT = `You are an expert livestock veterinary assistant for Indian farmers.
Farmers describe symptoms in simple everyday language — NOT medical terms.
They might say: "cow not eating", "buffalo stomach big", "leg swollen", "milk reduced", "mouth sores", "cow weak and tired", "stomach tight", etc.

Your job: Understand the symptoms however informally written, and return ONLY a valid JSON object with no markdown, no explanation, no preamble.

SEVERITY RULES — be accurate, not always "mild":
- "mild"     → minor issue, animal still functional (e.g. slight appetite loss, small wound)
- "moderate" → significant issue needing attention within 24h (e.g. mastitis, bad limping, bloat)
- "severe"   → emergency, call vet immediately (e.g. seizures, cannot stand, heavy bleeding, high fever 3+ days, FMD)

Examples of correct severity mapping:
- Cannot stand / unconscious → severe
- Blood in milk or dung → moderate to severe
- Heavy / fast breathing → moderate to severe
- Swollen hot udder + fever → moderate to severe
- Blisters in mouth + drooling + not eating → severe (likely FMD)
- Bloated stomach + lying down in pain → severe
- Mild limping, still walking → moderate
- Small wound, eating normally → mild

Return this exact JSON structure:
{
  "success": true,
  "severity": "mild" | "moderate" | "severe",
  "possible_conditions": ["condition 1", "condition 2", "condition 3"],
  "immediate_actions": ["action 1", "action 2", "action 3", "action 4"],
  "medicines": ["medicine 1", "medicine 2"],
  "when_to_call_vet": "Clear guidance on when a real vet is needed",
  "prevention": "Simple prevention advice for the farmer"
}

Rules:
- possible_conditions: 2–4 items in plain English (not Latin)
- immediate_actions: 3–5 practical steps a farmer can do RIGHT NOW
- medicines: 1–3 common OTC options, or [] if prescription-only needed
- when_to_call_vet: Always include. If severe, say "Call vet IMMEDIATELY"
- Never give final diagnosis — use "likely", "possibly", "may be"
- Never say the animal is fine if symptoms sound serious`;

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { symptoms } = req.body || {};
  if (!symptoms?.trim()) {
    return res.status(400).json({ success: false, error: "No symptoms provided." });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY not set in environment variables");
    return res.status(500).json({ success: false, error: "Server configuration error." });
  }

  const userMessage = `A farmer reports the following about their livestock:
"${symptoms.trim()}"

Analyze these symptoms carefully. Even if the language is informal or broken English, identify the health issue accurately. Return ONLY the JSON object.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", response.status, errText);
      return res.status(502).json({ success: false, error: "AI service error. Please try again." });
    }

    const data = await response.json();
    const rawText = data.content
      ?.filter(b => b.type === "text")
      .map(b => b.text)
      .join("")
      .trim();

    if (!rawText) {
      return res.status(502).json({ success: false, error: "Empty AI response. Please try again." });
    }

    // Strip accidental markdown fences
    const cleaned = rawText.replace(/```json|```/gi, "").trim();
    const parsed = JSON.parse(cleaned);

    if (!parsed.severity || !parsed.possible_conditions) {
      throw new Error("Missing required fields in AI response");
    }

    return res.status(200).json({ ...parsed, success: true });

  } catch (e) {
    console.error("analyzeSymptoms error:", e.message);
    return res.status(500).json({ success: false, error: "Analysis failed. Please rephrase and try again." });
  }
}