import React, { useState, useEffect } from 'react';
import { Sun, Activity, Droplets } from 'lucide-react';
import { getWeeklyMilk } from '../services/api';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

// Tips based on scanned breed
const BREED_TIPS = {
  "Murrah Buffalo":     "Murrah buffaloes need cool shaded areas in hot weather. Ensure plenty of clean drinking water to maintain high milk yield.",
  "Gir Cow":            "Gir cows are heat-tolerant but still need shade and fresh water today. Check udder health before evening milking.",
  "Holstein Friesian":  "Holstein Friesians are sensitive to heat. Keep them in a cool area and maintain regular milking schedule for best yield.",
  "Sahiwal":            "Sahiwal cows are well-adapted to local conditions. Provide mineral supplements today to boost milk production.",
  "Tharparkar":         "Tharparkar cattle are drought-resistant. Ensure balanced feed with green fodder for optimal health.",
  "Kankrej":            "Kankrej cattle need regular hoof inspection. Check for any limping and provide soft dry bedding.",
  "Jersey Cow":         "Jersey cows are efficient milk producers. Ensure high-quality feed and clean water for best results today.",
};

const DEFAULT_TIP = "Ensure all your livestock have shaded standing areas and plenty of drinking water to maintain milk yield.";

export default function Dashboard() {
  const [todayMilk, setTodayMilk]       = useState(null);
  const [farmerName, setFarmerName]     = useState("Farmer");
  const [initials, setInitials]         = useState("F");
  const [tip, setTip]                   = useState(DEFAULT_TIP);
  const [totalAnimals, setTotalAnimals] = useState("14");

  useEffect(() => {
    // Load milk data
    async function fetchMilk() {
      try {
        const data = await getWeeklyMilk();
        if (data.success && data.weekly.length > 0) {
          const todayStr = new Date().toISOString().split("T")[0];
          const todayEntry = data.weekly.find(d => d.date === todayStr);
          setTodayMilk(todayEntry ? todayEntry.liters : 0);
        }
      } catch (e) { console.error(e); }
    }

    // Load farmer profile from Firebase
    async function fetchProfile() {
      try {
        const snap = await getDoc(doc(db, "farmers", "farmer_1"));
        if (snap.exists()) {
          const data = snap.data();
          if (data.name) {
            setFarmerName(data.name);
            setInitials(data.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2));
          }
          if (data.totalAnimals) setTotalAnimals(data.totalAnimals);
        }
      } catch (e) { console.error(e); }
    }

    // Load last scan tip from localStorage
    try {
      const saved = localStorage.getItem("lastScanResult");
      if (saved) {
        const scan = JSON.parse(saved);
        if (scan.breed && BREED_TIPS[scan.breed]) {
          setTip(BREED_TIPS[scan.breed]);
        }
      }
    } catch (e) {}

    fetchMilk();
    fetchProfile();
  }, []);

  return (
    <div className="dashboard-page">
      <header className="header">
        <div>
          <p>नमस्ते (Namaste),</p>
          <h1>{farmerName}</h1>
        </div>
        <div className="profile-avatar">{initials}</div>
      </header>

      {/* Today's Tip — based on last scanned animal */}
      <div className="card sticky-tip">
        <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
          <Sun size={24} color="#e07a5f" />
          <h2>Today's Tip</h2>
        </div>
        <p>{tip}</p>
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{margin: 0, textAlign: 'center'}}>
          <Activity size={32} color="var(--color-primary)" style={{margin: '0 auto 8px'}} />
          <h2>{totalAnimals} Total</h2>
          <p>Livestock</p>
        </div>
        <div className="card" style={{margin: 0, textAlign: 'center'}}>
          <Droplets size={32} color="#0077b6" style={{margin: '0 auto 8px'}} />
          <h2>{todayMilk === null ? '...' : `${todayMilk} L`}</h2>
          <p>Today's Milk</p>
        </div>
      </div>

      {/* Alerts */}
      <h2>Important Alerts</h2>
      <div className="card" style={{ borderLeft: '4px solid var(--color-accent)' }}>
        <h3 style={{fontSize: '1rem', marginBottom: '4px'}}>Vaccination Due</h3>
        <p>FMD vaccine required for "Gauri" (Cow #4) by tomorrow.</p>
      </div>
    </div>
  );
}