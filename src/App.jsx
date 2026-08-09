// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

import Navigation     from './components/Navigation';
import Login          from './pages/Login';
import Dashboard      from './pages/Dashboard';
import HealthTracking from './pages/HealthTracking';
import ImageScanner   from './pages/ImageScanner';
import MilkProduction from './pages/MilkProduction';
import FarmerProfile  from './pages/FarmerProfile';
import BreedEncyclopedia from './pages/BreedEncyclopedia';
import VaccineInfo    from './pages/VaccineInfo';

function App() {
  const [user, setUser]       = useState(undefined); // undefined = loading
  const [ready, setReady]     = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
    return () => unsub();
  }, []);

  // Show nothing while Firebase checks auth state
  if (!ready) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #0a2e1f, #1B4332)",
        fontSize: "36px"
      }}>
        🐄
      </div>
    );
  }

  return (
    <Router>
      {user ? (
        // ── Logged in ──
        <div className="main-content">
          <Routes>
            <Route path="/"        element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/health"  element={<HealthTracking />} />
            <Route path="/scan"    element={<ImageScanner />} />
            <Route path="/milk"    element={<MilkProduction />} />
            <Route path="/profile" element={<FarmerProfile />} />
            <Route path="/breeds"  element={<BreedEncyclopedia />} />
            <Route path="/vaccines" element={<VaccineInfo />} />
            <Route path="/login"   element={<Navigate to="/dashboard" replace />} />
            <Route path="*"        element={<Dashboard />} />
          </Routes>
          <Navigation />
        </div>
      ) : (
        // ── Not logged in ──
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*"      element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;