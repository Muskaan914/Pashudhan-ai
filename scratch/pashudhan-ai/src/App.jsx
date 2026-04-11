// src/App.jsx — Updated with new routes
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import HealthTracking from './pages/HealthTracking';
import ImageScanner from './pages/ImageScanner';
import MilkProduction from './pages/MilkProduction';
import ChatbotHelper from './pages/ChatbotHelper';
import FarmerProfile from './pages/FarmerProfile';
import BreedEncyclopedia from './pages/BreedEncyclopedia';
import VaccineInfo from './pages/VaccineInfo';

function App() {
  return (
    <Router>
      <div className="main-content">
        <Routes>
          <Route path="/"          element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/health"    element={<HealthTracking />} />
          <Route path="/scan"      element={<ImageScanner />} />
          <Route path="/milk"      element={<MilkProduction />} />
          <Route path="/chat"      element={<ChatbotHelper />} />
          <Route path="/profile"   element={<FarmerProfile />} />
          <Route path="/breeds"    element={<BreedEncyclopedia />} />
          <Route path="/vaccines"  element={<VaccineInfo />} />
          <Route path="*"          element={<Dashboard />} />
        </Routes>
      </div>
      <Navigation />
    </Router>
  );
}

export default App;