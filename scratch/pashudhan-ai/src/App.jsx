import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import HealthTracking from './pages/HealthTracking';
import ImageScanner from './pages/ImageScanner';
import MilkProduction from './pages/MilkProduction';
import ChatbotHelper from './pages/ChatbotHelper';

function App() {
  return (
    <Router>
      <div className="main-content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/health" element={<HealthTracking />} />
          <Route path="/scan" element={<ImageScanner />} />
          <Route path="/milk" element={<MilkProduction />} />
          <Route path="/chat" element={<ChatbotHelper />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
      <Navigation />
    </Router>
  );
}

export default App;
