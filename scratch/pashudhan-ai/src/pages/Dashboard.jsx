import React, { useState, useEffect } from 'react';
import { Sun, Activity, Droplets } from 'lucide-react';
import { getWeeklyMilk } from '../services/api';

const Dashboard = () => {
  const [todayMilk, setTodayMilk] = useState(null);

  useEffect(() => {
    async function fetchMilk() {
      try {
        const data = await getWeeklyMilk();
        if (data.success && data.weekly.length > 0) {
          const todayStr = new Date().toISOString().split("T")[0];
          const todayEntry = data.weekly.find(d => d.date === todayStr);
          setTodayMilk(todayEntry ? todayEntry.liters : 0);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchMilk();
  }, []);

  return (
    <div className="dashboard-page">
      <header className="header">
        <div>
          <p>नमस्ते (Namaste),</p>
          <h1>Farmer Ram Singh</h1>
        </div>
        <div className="profile-avatar">RS</div>
      </header>

      {/* Weather & Tips Card */}
      <div className="card sticky-tip">
        <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px'}}>
          <Sun size={24} color="#e07a5f" />
          <h2>Today's Tip</h2>
        </div>
        <p>It's going to be a hot afternoon (38°C). Ensure your Murrah buffaloes have shaded standing areas and plenty of drinking water to maintain milk yield.</p>
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{margin: 0, textAlign: 'center'}}>
          <Activity size={32} color="var(--color-primary)" style={{margin: '0 auto 8px'}} />
          <h2>14 Total</h2>
          <p>Livestock</p>
        </div>
        <div className="card" style={{margin: 0, textAlign: 'center'}}>
          <Droplets size={32} color="#0077b6" style={{margin: '0 auto 8px'}} />
          <h2>{todayMilk === null ? '...' : `${todayMilk} L`}</h2>
          <p>Today's Milk</p>
        </div>
      </div>

      {/* Action Area */}
      <h2>Important Alerts</h2>
      <div className="card" style={{ borderLeft: '4px solid var(--color-accent)' }}>
        <h3 style={{fontSize: '1rem', marginBottom: '4px'}}>Vaccination Due</h3>
        <p>FMD vaccine required for "Gauri" (Cow #4) by tomorrow.</p>
      </div>
    </div>
  );
};

export default Dashboard;