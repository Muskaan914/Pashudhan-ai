# 🐄 Pashudhan AI — Smart Livestock Management

A mobile-first React web app for Indian farmers to identify cattle breeds, track milk production, monitor animal health, and manage livestock profiles using AI.

---

## 🚀 Live Demo

🌐 **Frontend:** [https://pashudhan-ai-sage.vercel.app](https://pashudhan-ai-sage.vercel.app)  
🤖 **Backend API:** [https://muskaan914-pashudhan-breed.hf.space](https://muskaan914-pashudhan-breed.hf.space)

---

## 🧠 AI Model — Backend (Hugging Face Space)

| Detail | Info |
|--------|------|
| **Platform** | Hugging Face Spaces |
| **Space URL** | `muskaan914/pashudhan-breed` |
| **Framework** | FastAPI + Docker |
| **Model Architecture** | EfficientNet-B0 (fastai) |
| **Model File** | `cattle_breed_model_fixed.pkl` |
| **Classes** | 41 cattle & buffalo breeds |
| **Overall Accuracy** | 61.60% |
| **Top-5 Accuracy** | 90.44% |
| **API Endpoint** | `POST /predict` |

### API Usage
```bash
curl -X POST "https://muskaan914-pashudhan-breed.hf.space/predict" \
  -F "file=@cow_image.jpg"
```

### API Response
```json
{
  "success": true,
  "breed": "Gir",
  "confidence": 83.45
}
```

### Validation Logic
- Images with **confidence < 45%** are rejected as non-cattle
- Images with **top-2 spread < 10%** are rejected as ambiguous
- Color variance & texture checks reject flags/logos/non-photos

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | CSS (mobile-first) |
| Routing | React Router v6 |
| Auth | Firebase Authentication |
| Database | Firebase Firestore |
| AI Backend | Hugging Face Spaces (FastAPI) |
| ML Model | EfficientNet-B0 via fastai |
| Deployment | Vercel (frontend) + HF Spaces (backend) |

---

## ✨ Features

- 🔍 **Breed Scanner** — Upload cattle photo → AI identifies breed with confidence score
- 🏥 **Health Tracker** — Symptom-based disease detection with medicine suggestions
- 🥛 **Milk Tracker** — Log daily milk production, view weekly charts
- 📚 **Breed Encyclopedia** — Info on 41 Indian & international breeds
- 💉 **Vaccine Guide** — Vaccination schedule with alerts
- 👤 **Farmer Profile** — Livestock management with breed search
- 🤖 **AI Helper** — Chatbot for livestock queries

---

## 📁 Project Structure

```
src/
├── assets/          # Images
├── components/      # Navigation
├── pages/           # All page components
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── ImageScanner.jsx
│   ├── HealthTracking.jsx
│   ├── MilkProduction.jsx
│   ├── FarmerProfile.jsx
│   ├── BreedEncyclopedia.jsx
│   ├── VaccineInfo.jsx
│   └── ChatbotHelper.jsx
├── services/
│   └── api.js       # HF Space API + breed database
├── firebase.js      # Firebase config
└── App.jsx          # Routes + auth guard
```

---

## 🔧 Setup & Run Locally

```bash
git clone https://github.com/Muskaan914/Pashudhan-ai.git
cd Pashudhan-ai/scratch/pashudhan-ai
npm install
npm run dev
```

---

## 🌿 Supported Breeds (41 classes)

**Indian Cows:** Gir, Sahiwal, Tharparkar, Kankrej, Ongole, Hariana, Rathi, Red Sindhi, Dangi, Deoni, Khillari, Hallikar, Amritmahal, Kangayam, Alambadi, Bargur, Malnad Gidda, Nagori, Nimari, Krishna Valley, Kenkatha, Toda, Pulikulam, Umblachery, Kasargod, Banni, Vechur

**Buffaloes:** Murrah, Jaffarabadi, Nagpuri, Surti, Nili-Ravi, Bhadawari, Mehsana

**Exotic Breeds:** Holstein Friesian, Jersey, Ayrshire, Brown Swiss, Guernsey, Red Dane

---

## 👩‍💻 Developer

**Muskaan Sharma**  
GitHub: [@Muskaan914](https://github.com/Muskaan914)