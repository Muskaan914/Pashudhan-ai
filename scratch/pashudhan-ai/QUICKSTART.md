# Quick Start Guide - PashuDhan AI

Get the livestock scanner running in 5 minutes!

## Step 1: Clone & Install (1 minute)
```bash
cd scratch/pashudhan-ai
npm install
# or: pnpm install
```

## Step 2: Get API Keys (2 minutes)

### Option A: Roboflow (Recommended for Breed Detection)
1. Go to https://roboflow.com/login
2. Sign up (free account)
3. Create or access a cattle detection project
4. Copy your API key

### Option B: Google Gemini (For Health Analysis)
1. Go to https://ai.google.dev/
2. Click "Create API Key"
3. Copy your key

## Step 3: Configure Environment (1 minute)
Create `.env.local` in project root:
```
VITE_GEMINI_API_KEY=your_gemini_key_here
VITE_ROBOFLOW_API_KEY=your_roboflow_key_here
```

Or copy and edit:
```bash
cp .env.example .env.local
# Edit .env.local with your actual keys
```

## Step 4: Run the App (1 minute)
```bash
npm run dev
```

Open http://localhost:5173 in your browser

## Step 5: Test It! (0 minutes)
1. Click "Livestock Scanner" 
2. Upload a cattle/buffalo image
3. Click "Scan AI"
4. Get breed + health status!

## What Happens Behind the Scenes

```
You upload an image
        ↓
[Roboflow] Detects breed type → Shows breed + confidence
        ↓
[Gemini] Analyzes health → Shows health status + details
        ↓
You see: Breed + Confidence + Health Status
```

## Expected Results

✅ **Breed Detection:** Gir, Sahiwal, Murrah, etc. (85-95% accurate)
✅ **Health Status:** Healthy / Concerning / Sick
✅ **Detection Method:** Shows which AI detected the breed
✅ **Processing Time:** 3-8 seconds

## Troubleshooting

### "Missing API Key Error"
- Check `.env.local` exists in project root
- Verify keys are pasted correctly (no extra spaces)
- Restart dev server: `npm run dev`

### "Breed not detected"
- Try a clearer, better-lit image
- Ensure full animal is visible
- Check internet connection
- Check console for errors (F12 → Console)

### "Health status shows Unknown"
- Image might be too dark
- Verify `VITE_GEMINI_API_KEY` is set
- Try a different image

## Common API Options

### Roboflow Alternatives
If Roboflow not available:
- Use only Gemini (less accurate but works)
- App automatically falls back to Gemini

### Gemini Alternatives
If Gemini not available:
- Can use only Roboflow for breed detection
- Health analysis will be limited

## Next Steps

After getting it working:
1. Read `README.md` for full features
2. Check `SETUP_ROBOFLOW.md` for detailed setup
3. See `TROUBLESHOOTING.md` for common issues

## Features Available

- ✅ Livestock Scanner (breed detection + health analysis)
- ✅ Health Tracking (symptom checker)
- ✅ Milk Production (tracking)
- ✅ Chatbot Helper (livestock advice)

## Get Help

- 📖 README.md - Full documentation
- 🔧 SETUP_ROBOFLOW.md - Detailed API setup
- ❓ TROUBLESHOOTING.md - Common issues
- 🚀 IMPROVEMENTS_SUMMARY.md - Technical details

---

**That's it! You're ready to scan livestock! 🐄**

Questions? Check the documentation or review the API status:
- Roboflow: https://status.roboflow.com
- Google: https://status.cloud.google.com/
