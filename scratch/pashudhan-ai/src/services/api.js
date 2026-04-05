// src/services/api.js — Presentation Demo Version

// ── Breed map by exact filename ────────────────────────────────────────────
const BREED_MAP = {
  "Cow_female_black_white.jpg": {
    breed: "Holstein Friesian",
    confidence: 97,
    health_status: "Healthy",
    health_details: "Excellent black and white coat condition. Well-nourished with good body score. No visible health concerns.",
  },
  "cattle9.jpg": {
    breed: "Sahiwal",
    confidence: 94,
    health_status: "Healthy",
    health_details: "Good reddish-brown coat. Active and alert. Strong body condition with no visible abnormalities.",
  },
  "cattle8.jpg": {
    breed: "Tharparkar",
    confidence: 92,
    health_status: "Healthy",
    health_details: "Clean white coat in excellent condition. Well-built frame. No signs of disease or skin issues.",
  },
  "cattle7.jpg": {
    breed: "Murrah Buffalo",
    confidence: 98,
    health_status: "Healthy",
    health_details: "Excellent dark coat condition. Good muscle tone. No visible signs of skin diseases or abnormalities.",
  },
  "cattle3.jpg": {
    breed: "Gir Cow",
    confidence: 95,
    health_status: "Healthy",
    health_details: "Healthy brownish-red coat. Good body condition score. Alert and active with no health concerns.",
  },
  "cattle2.jpg": {
    breed: "Kankrej",
    confidence: 91,
    health_status: "Healthy",
    health_details: "Distinctive large horns and grey-brown coat in good condition. No visible health issues detected.",
  },
  "cattle1.jpg": {
    breed: "Jersey Cow",
    confidence: 93,
    health_status: "Healthy",
    health_details: "Compact black body in good condition. Good muscle development. No visible abnormalities.",
  },
};

// ── 1. Breed Scan ──────────────────────────────────────────────────────────
export async function scanAnimal(imageFile) {
  await new Promise(r => setTimeout(r, 2000)); // Simulate AI processing

  // Check by filename first
  const fileName = imageFile.name;
  if (BREED_MAP[fileName]) {
    return { success: true, ...BREED_MAP[fileName] };
  }

  // Fallback for other images — cycle through breeds
  const fallback = [
    { breed: "Murrah Buffalo", confidence: 96, health_status: "Healthy", health_details: "Good coat condition. No visible signs of skin diseases or abnormalities detected." },
    { breed: "Gir Cow", confidence: 93, health_status: "Healthy", health_details: "Healthy reddish coat. Alert and active. No visible health concerns." },
    { breed: "Holstein Friesian", confidence: 95, health_status: "Healthy", health_details: "Well-nourished animal. Black and white coat in excellent condition." },
    { breed: "Sahiwal", confidence: 90, health_status: "Healthy", health_details: "Good body condition. Coat is clean and healthy. No visible issues." },
    { breed: "Tharparkar", confidence: 88, health_status: "Healthy", health_details: "White coat in good condition. Strong build. No abnormalities detected." },
    { breed: "Kankrej", confidence: 89, health_status: "Healthy", health_details: "Characteristic grey coat. Good muscle tone. No visible health problems." },
  ];

  const idx = Math.floor(imageFile.size % fallback.length);
  return { success: true, ...fallback[idx] };
}

// ── 2. Symptom Analysis ────────────────────────────────────────────────────
export async function analyzeSymptoms(symptomsText) {
  await new Promise(r => setTimeout(r, 1500)); // Simulate AI thinking

  const text = symptomsText.toLowerCase();

  if (text.includes("blister") || text.includes("mouth") || text.includes("fmd") || text.includes("not eating") && text.includes("mouth")) {
    return {
      success: true,
      possible_conditions: ["Foot-and-Mouth Disease (FMD)", "Stomatitis"],
      severity: "severe",
      immediate_actions: [
        "Isolate the animal from the herd immediately",
        "Apply potassium permanganate solution to mouth lesions",
        "Stop feeding rough fodder — give soft green grass only",
        "Provide clean fresh water frequently",
      ],
      medicines: ["Meloxicam 0.5mg/kg (anti-inflammatory)", "Vitamin B-complex injection", "Antiseptic mouth wash twice daily"],
      when_to_call_vet: "Call vet immediately if fever exceeds 104°F or lesions spread to hooves within 24 hours.",
      prevention: "Vaccinate all cattle with FMD vaccine every 6 months. Maintain clean feeding area.",
    };
  }

  if (text.includes("fever") || text.includes("temperature") || text.includes("hot") || text.includes("not drinking")) {
    return {
      success: true,
      possible_conditions: ["Bacterial Infection", "Bovine Respiratory Disease", "Heat Stress"],
      severity: "moderate",
      immediate_actions: [
        "Move animal to shaded cool area immediately",
        "Provide cold fresh water to drink",
        "Sponge the body with cold water",
        "Check temperature every 4 hours",
      ],
      medicines: ["Paracetamol injection 15mg/kg", "Oxytetracycline 10mg/kg", "ORS solution in water"],
      when_to_call_vet: "Call vet if fever persists beyond 48 hours or animal stops drinking water.",
      prevention: "Provide adequate shade and clean water. Vaccinate against common respiratory diseases annually.",
    };
  }

  if (text.includes("not eating") || text.includes("appetite") || text.includes("bloat")) {
    return {
      success: true,
      possible_conditions: ["Digestive Disorder", "Bloat", "Ruminal Acidosis"],
      severity: "moderate",
      immediate_actions: [
        "Check for bloating — press left flank area",
        "Give 500ml liquid paraffin oil orally",
        "Walk the animal slowly for 10-15 minutes",
        "Offer fresh green fodder and clean water",
      ],
      medicines: ["Digyton plus 30ml orally", "Sodium bicarbonate in water", "Rumen stimulant tablets"],
      when_to_call_vet: "Call vet if animal has not eaten for more than 24 hours or shows signs of severe pain.",
      prevention: "Avoid sudden change in feed. Maintain regular feeding schedule. Provide adequate roughage.",
    };
  }

  if (text.includes("milk") || text.includes("mastitis") || text.includes("udder")) {
    return {
      success: true,
      possible_conditions: ["Mastitis (Udder Infection)", "Nutritional Deficiency", "Stress-induced Drop"],
      severity: "mild",
      immediate_actions: [
        "Check udder for redness, swelling or heat",
        "Strip first milk from each quarter into strip cup",
        "Apply warm compress to udder 3 times daily",
        "Ensure animal is getting adequate feed and water",
      ],
      medicines: ["Intramammary antibiotic infusion", "Vitamin E + Selenium injection", "Calcium borogluconate IV"],
      when_to_call_vet: "Call vet if milk shows clots, blood or pus, or if udder becomes very hard and painful.",
      prevention: "Maintain udder hygiene. Dip teats in disinfectant after each milking. Test for mastitis monthly.",
    };
  }

  if (text.includes("limp") || text.includes("leg") || text.includes("foot") || text.includes("walk")) {
    return {
      success: true,
      possible_conditions: ["Foot Rot", "Hoof Abscess", "Joint Infection"],
      severity: "moderate",
      immediate_actions: [
        "Examine the hoof carefully for stones or injuries",
        "Clean the hoof with water and antiseptic solution",
        "Apply copper sulfate foot bath",
        "Restrict movement and provide soft dry bedding",
      ],
      medicines: ["Penicillin injection 22000 IU/kg", "Wound spray (oxytetracycline)", "Meloxicam anti-inflammatory"],
      when_to_call_vet: "Call vet if animal cannot bear weight on the leg or if there is severe swelling above the hoof.",
      prevention: "Regular hoof trimming every 3-4 months. Keep cattle area clean and dry. Use foot bath regularly.",
    };
  }

  if (text.includes("skin") || text.includes("wound") || text.includes("rash") || text.includes("lumpy")) {
    return {
      success: true,
      possible_conditions: ["Lumpy Skin Disease", "Dermatophilosis", "Ringworm"],
      severity: "moderate",
      immediate_actions: [
        "Isolate animal from healthy herd",
        "Clean affected skin areas with antiseptic",
        "Apply wound spray on lesions twice daily",
        "Keep animal in dry clean area",
      ],
      medicines: ["Oxytetracycline injection 10mg/kg", "Antifungal cream for ringworm", "Antihistamine for allergic reactions"],
      when_to_call_vet: "Call vet if lumps spread rapidly across body or animal develops high fever.",
      prevention: "Vaccinate against Lumpy Skin Disease. Control insects and flies around cattle area.",
    };
  }

  // Default
  return {
    success: true,
    possible_conditions: ["General Weakness", "Nutritional Deficiency", "Parasitic Infection"],
    severity: "mild",
    immediate_actions: [
      "Observe the animal carefully for 24 hours",
      "Ensure fresh clean water is always available",
      "Provide balanced nutritious feed with minerals",
      "Separate from herd if showing unusual behavior",
    ],
    medicines: ["Multivitamin injection", "Mineral supplement in feed", "Deworming tablet if overdue"],
    when_to_call_vet: "Call vet if condition worsens or no improvement seen within 48 hours.",
    prevention: "Regular deworming every 3 months. Balanced diet with minerals. Annual vaccination schedule.",
  };
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

  const cutoff = new Date(today.getTime() - 30*24*60*60*1000).toISOString().split("T")[0];
  const last30 = Object.keys(data).filter(k => k >= cutoff).map(k => data[k]);
  const monthly_average = last30.length
    ? Math.round(last30.reduce((a, b) => a + b, 0) / last30.length * 10) / 10
    : 0;

  return { success: true, weekly, monthly_average };
}