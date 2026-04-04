# PashuDhan AI - Livestock Management System

An intelligent livestock management platform using AI for breed detection, health monitoring, and farm management.

## Features

### 🐄 AI Livestock Scanner
- **Breed Detection**: Identify cattle and buffalo breeds with high accuracy using specialized Roboflow models
- **Health Analysis**: Automatic health status assessment (Healthy/Concerning/Sick)
- **Visual Health Indicators**: Analyzes coat condition, body score, and visible health concerns
- **Dual API Approach**: 
  - Primary: Roboflow specialized livestock detection model
  - Fallback: Google Gemini vision analysis for robustness

### 🏥 Health Tracking
- AI-powered symptom analysis and veterinary guidance
- Severity assessment (mild, moderate, severe)
- Recommended immediate actions and medicines
- When-to-call-vet guidance
- Prevention tips based on detected conditions

### 🥛 Milk Production Tracking
- Daily milk production logging
- Weekly production analytics
- Historical data tracking via backend integration

### 💬 AI Chatbot Helper
- Livestock care advice
- Common disease information
- Best practices for Indian breeds

## Setup

### Prerequisites
- Node.js (v18+)
- npm, pnpm, or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Create `.env.local` file (copy from `.env.example`):
   ```bash
   cp .env.example .env.local
   ```

4. Add your API keys:
   - **VITE_GEMINI_API_KEY**: Get from [Google AI Studio](https://ai.google.dev/)
   - **VITE_ROBOFLOW_API_KEY**: Get from [Roboflow](https://roboflow.com/)

### Running the App

```bash
npm run dev
# App will be available at http://localhost:5173
```

## API Configuration

### Roboflow (Breed Detection)
1. Sign up at [Roboflow](https://roboflow.com)
2. Access or create a cattle breed detection project
3. Get your API key from the API section
4. Add to `.env.local`: `VITE_ROBOFLOW_API_KEY=your_key`

### Google Gemini (Fallback & Health Analysis)
1. Visit [Google AI Studio](https://ai.google.dev/)
2. Create an API key (free tier available)
3. Add to `.env.local`: `VITE_GEMINI_API_KEY=your_key`

See [SETUP_ROBOFLOW.md](./SETUP_ROBOFLOW.md) for detailed setup instructions.

## Supported Cattle Breeds
- Gir
- Sahiwal
- Murrah Buffalo
- Surti Buffalo
- Holstein Friesian
- Jersey
- Tharparkar
- Kankrej
- Ongole
- And more...

## Project Structure
```
src/
├── pages/           # React page components
│   ├── Dashboard.jsx
│   ├── ImageScanner.jsx      # Breed detection UI
│   ├── HealthTracking.jsx    # Health analysis UI
│   ├── MilkProduction.jsx
│   └── ChatbotHelper.jsx
├── services/
│   └── api.js               # API integration layer
└── components/
    └── Navigation.jsx
```

## API Improvements

### Recent Updates
- ✅ Integrated Roboflow specialized livestock models for better breed accuracy
- ✅ Implemented hybrid API approach for reliability
- ✅ Enhanced health analysis with visual indicators
- ✅ Added health alert system for concerning animals
- ✅ Improved error handling and fallback mechanisms

## Troubleshooting

### Breed detection not working?
1. Verify both API keys are set in `.env.local`
2. Check image quality and visibility of the animal
3. Try different angles or lighting
4. Check browser console for specific error messages

### Health analysis showing "Unknown"?
1. Ensure the image clearly shows the livestock
2. Check that Gemini API key is valid
3. Try re-uploading the image

## Performance Notes
- Image upload is optimized for fast processing
- API calls are cached where appropriate
- Fallback mechanisms ensure app continues even if one API fails

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License
[Your License Here]

## Support & Contribution
For issues or contributions, please contact the development team.
