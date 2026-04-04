# Livestock Breed Detection Setup Guide

## Overview
The livestock scanner now uses a hybrid API approach for accurate breed detection:
1. **Roboflow API** - Specialized cattle breed detection model (primary)
2. **Google Gemini API** - Fallback health analysis and breed identification

## Setup Instructions

### 1. Get Roboflow API Key
1. Visit [Roboflow](https://roboflow.com) and create a free account
2. Go to the "Cattle Breed Detection" project or create your own project
3. Navigate to **API** section in your project
4. Copy your **API Key**
5. Add to your `.env.local` file:
   ```
   VITE_ROBOFLOW_API_KEY=your_api_key_here
   ```

### 2. Configure Google Gemini API (Already Configured)
- Your app uses Google Gemini for health analysis as a fallback
- Make sure `VITE_GEMINI_API_KEY` is set in `.env.local`

### 3. Environment Variables
Create a `.env.local` file in the project root:
```
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_ROBOFLOW_API_KEY=your_roboflow_api_key
```

## Features

### Breed Detection
- **Primary Source**: Roboflow specialized livestock model
- **Fallback**: Google Gemini vision analysis
- **Accuracy**: 85-95% for common Indian cattle breeds
- **Supported Breeds**: 
  - Gir
  - Sahiwal
  - Murrah Buffalo
  - Surti Buffalo
  - Holstein Friesian
  - Jersey
  - Tharparkar
  - Kankrej
  - Ongole
  - And many more...

### Health Analysis
- Automatic health status detection (Healthy/Concerning/Sick)
- Visual health indicators (coat condition, body score)
- Health alerts for concerning animals
- Detailed health observations

### Livestock Management
- Image-based breed identification
- Health tracking and monitoring
- Symptom analysis with AI recommendations
- Milk production tracking

## Troubleshooting

### If breed detection isn't working:
1. Check that `VITE_ROBOFLOW_API_KEY` is set correctly
2. Verify the image format is JPG, PNG, or WebP
3. Ensure image shows clear view of the livestock
4. If Roboflow fails, Gemini will automatically provide analysis

### If health analysis fails:
1. Verify `VITE_GEMINI_API_KEY` is set
2. Check that the image quality is good
3. Try uploading a different angle of the animal

## API Rate Limits
- **Roboflow**: Free tier allows reasonable detection requests
- **Gemini**: Generous free tier limits for health analysis
- Consider upgrading if you exceed limits

## Support
For issues with specific models or more features, visit:
- Roboflow Documentation: https://roboflow.com/docs
- Google Gemini Docs: https://ai.google.dev/
