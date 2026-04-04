// src/services/api.js
const BASE_URL = "https://pashudhan-ai-backend-2.onrender.com";

export async function scanAnimal(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);
  const res = await fetch(`${BASE_URL}/api/predict/`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json();
}

export async function analyzeSymptoms(symptomsText) {
  const res = await fetch(`${BASE_URL}/api/analyze-symptoms/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symptoms: symptomsText }),
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json();
}

export async function addMilkEntry(liters) {
  const res = await fetch(`${BASE_URL}/api/milk/add/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ liters: parseFloat(liters) }),
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json();
}

export async function getWeeklyMilk() {
  const res = await fetch(`${BASE_URL}/api/milk/weekly/`);
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json();
}
