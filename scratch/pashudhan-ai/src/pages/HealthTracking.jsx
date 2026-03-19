import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Activity, HeartPulse } from 'lucide-react';

const HealthTracking = () => {
  const [symptom, setSymptom] = useState('');
  const [prediction, setPrediction] = useState(null);

  const handlePredict = () => {
    if (!symptom) return;
    setPrediction({
      disease: 'Foot and Mouth Disease (Suspected)',
      confidence: '85%',
      advice: 'Isolate the animal immediately. Contact local vet. Apply mild antiseptic to visible sores.'
    });
  };

  return (
    <div className="health-page">
      <header className="header" style={{ marginBottom: '16px' }}>
        <div>
          <p>Health Management</p>
          <h1>Livestock Health</h1>
        </div>
        <HeartPulse size={36} color="var(--color-primary)" />
      </header>

      {/* Symptom Checker */}
      <div className="card">
        <h2>AI Symptom Checker</h2>
        <p style={{marginBottom: '12px'}}>Enter observed symptoms (e.g., limping, fever, reduced milk):</p>
        <textarea 
          placeholder="e.g. My buffalo has blisters on its mouth and is not eating..."
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
          style={{
            width: '100%', height: '80px', padding: '12px', 
            borderRadius: 'var(--radius-sm)', border: '1px solid #ccc',
            marginBottom: '12px', fontFamily: 'inherit'
          }}
        />
        <button className="btn btn-primary" style={{width: '100%'}} onClick={handlePredict}>
          <Activity size={20} />
          Analyze Symptoms
        </button>

        {prediction && (
          <div style={{marginTop: '16px', padding: '16px', backgroundColor: 'var(--color-accent-light)', borderRadius: 'var(--radius-sm)'}}>
            <h3 style={{color: '#b05d46', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <AlertTriangle size={20}/>
              {prediction.disease}
            </h3>
            <p style={{margin: '8px 0'}}><strong>Confidence:</strong> {prediction.confidence}</p>
            <p><strong>Action:</strong> {prediction.advice}</p>
          </div>
        )}
      </div>

      <h2>Recent Health Log</h2>
      <div className="card">
        <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
          <CheckCircle color="green" size={24} />
          <div>
            <h3>Cow #4 (Gauri)</h3>
            <p>FMD Vaccination completed</p>
            <p style={{fontSize: '0.8rem', marginTop: '4px'}}>2 days ago</p>
          </div>
        </div>
        <hr style={{margin: '12px 0', border: 'none', borderTop: '1px solid #eee'}} />
        <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
          <Activity color="orange" size={24} />
          <div>
            <h3>Buffalo #2 (Murrah)</h3>
            <p>Monitored for low milk yield</p>
            <p style={{fontSize: '0.8rem', marginTop: '4px'}}>Yesterday</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTracking;
