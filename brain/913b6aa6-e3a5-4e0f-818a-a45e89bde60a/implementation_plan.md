# Pashudhan AI Application Implementation Plan

## Goal Description
Build a production-ready, high-fidelity UI for "Pashudhan AI" — a livestock management app tailored for Indian farmers. The app will feature a farmer-friendly dashboard, animal health tracking, milk production logs, an AI image-based disease/breed detector, and a bilingual chatbot helper. We will apply the "Stitch Design" methodology to architect a cohesive earthy/agricultural design system and use React with Vanilla CSS for maximum aesthetic control.

## Proposed Changes

### 1. Project Initialization & Architecture
We will set up a modern React Single Page Application.
#### [NEW] `package.json` / Vite React Setup
- Initialize the application in `pashudhan-ai` using `npx -y create-vite@latest ./pashudhan-ai --template react`.
- Configure Vanilla CSS structure targeting a mobile-first, offline-friendly responsive design.
- Define routing for major views (Dashboard, Health, Milk, AI Camera, Chatbot).

### 2. Design System (`.stitch/DESIGN.md` approach)
Following the Stitch design skill, we will codify our "Design DNA":
- **Palette**: Earthy Greens (Primary Action), Warm Terracotta (Alerts/Diseases), Off-White/Sand (Backgrounds).
- **Typography**: Clean, readable sans-serif (e.g., Inter or Roboto) with large font sizes for rural accessibility.
- **UI Elements**: Large tap targets (buttons), glassmorphism cards for the dashboard, distinctive iconography.

### 3. Core Components
#### [NEW] `src/components/Navigation.jsx`
- Bottom tab bar for mobile navigation (Home, Health, AI Camera, Milk, Chat).
#### [NEW] `src/pages/Dashboard.jsx`
- High-level livestock summary, weather/breed tips, and quick-action buttons. 
#### [NEW] `src/pages/HealthTracking.jsx`
- Symptom input form, vaccination reminders, and medical history timeline.
#### [NEW] `src/pages/MilkProduction.jsx`
- Daily logging system with visual charts for milk yields.
#### [NEW] `src/pages/ImageScanner.jsx`
- UI simulating Camera/Gallery upload.
- Layout for AI results: Image preview, breed detection (Murrah/Jaffarabadi), and health predictions with confidence rings.
#### [NEW] `src/pages/ChatbotHelper.jsx`
- Bilingual (Hindi + English) chat interface with voice-input mockups.

### 4. Media & Assets
#### [NEW] `src/assets/*`
- Use the AI `generate_image` tool to craft realistic, high-fidelity images of Indian livestock (buffaloes) and award-winning rural UI mockups to embed directly in the app.

---

## User Review Required
> [!IMPORTANT]
> The platform currently restricts direct "Stitch MCP Server" tool calls within my runtime, but I will manually write out the absolute highest-fidelity code conforming to the Stitch design specifications, and generate the Indian agricultural assets using my built-in image generator.

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure the project bundles successfully without syntax errors.
- Start `npm run dev` background process.

### Visual Verification
- Use the **Browser Subagent** tool to navigate to `http://localhost:5173`.
- Take screenshots and navigate through every tab (Dashboard, Health, AI Scanner, Chatbot).
- Verify the layout is farmer-friendly, mobile-first, and matches the "earthy/agricultural" theme.
