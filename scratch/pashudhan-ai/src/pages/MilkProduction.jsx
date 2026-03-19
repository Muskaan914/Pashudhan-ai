import React, { useState } from 'react';
import { Droplets, Calendar, BarChart3, PlusCircle } from 'lucide-react';

const MilkProduction = () => {
  const [liters, setLiters] = useState('');
  
  const handleLog = () => {
    if(!liters) return;
    alert(`Logged ${liters} Liters for Today!`);
    setLiters('');
  };

  return (
    <div className="milk-page">
      <header className="header">
        <div>
          <p>Production</p>
          <h1>Milk Tracking</h1>
        </div>
        <Droplets size={36} color="#0077b6" />
      </header>

      {/* Quick Add */}
      <div className="card" style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
        <input 
          type="number" 
          placeholder="Liters" 
          value={liters}
          onChange={(e) => setLiters(e.target.value)}
          style={{flex: 1, padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid #ccc', fontSize: '1.2rem'}}
        />
        <button className="btn btn-primary" onClick={handleLog} style={{padding: '12px 16px', borderRadius: 'var(--radius-sm)'}}>
          <PlusCircle size={24} /> Add
        </button>
      </div>

      {/* Weekly Graph Mockup */}
      <h2>Weekly Yield (Total)</h2>
      <div className="card" style={{height: '240px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '24px 12px 12px'}}>
        {[45, 48, 42, 50, 46, 44, 49].map((val, idx) => (
          <div key={idx} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{
              height: `${(val / 60) * 150}px`, 
              width: '24px', 
              backgroundColor: idx === 6 ? '#0077b6' : 'var(--color-secondary)',
              borderRadius: '4px 4px 0 0',
              transition: 'height 0.3s ease'
            }}></div>
            <span style={{fontSize: '0.75rem', marginTop: '8px', color: 'var(--color-text-muted)'}}>
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][idx]}
            </span>
          </div>
        ))}
      </div>

      <div className="card" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          <BarChart3 size={24} color="var(--color-primary-dark)" />
          <h3>Monthly Average</h3>
        </div>
        <h2 style={{color: '#0077b6'}}>46 L / day</h2>
      </div>
    </div>
  );
};

export default MilkProduction;
