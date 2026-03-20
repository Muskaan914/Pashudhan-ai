import React, { useState, useRef } from 'react';
import { Camera, Upload, CheckCircle2, Search, XCircle } from 'lucide-react';
import buffaloImg from '../assets/buffalo.png';

const API_URL = 'https://brokenly-insupportable-carmine.ngrok-free.app';

const ImageScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setSelectedFile(file);
      setResult(null);
      setError(null);
    }
  };

  const handleScan = async () => {
    if (!selectedFile) {
      setError('Please select an image first.');
      return;
    }

    setScanning(true);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch(`${API_URL}/api/predict/`, {
        method: 'POST',
        body: formData,
        headers: {
          'ngrok-skip-browser-warning': 'true',
       },

      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult({
          breed: data.breed,
          confidence: `${(data.confidence * 100).toFixed(1)}%`,
          health: 'Analyzed',
          notes: `Top breed detected: ${data.breed}. Confidence: ${(data.confidence * 100).toFixed(1)}%`,
          top5: data.top_5
        });
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure backend is running.');
    } finally {
      setScanning(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="scanner-page">
      <header className="header">
        <div>
          <p>AI Vision</p>
          <h1>Livestock Scanner</h1>
        </div>
        <Camera size={36} color="var(--color-primary)" />
      </header>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div className="card" style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
        <div style={{ position: 'relative' }}>
          <img
            src={selectedImage || buffaloImg}
            alt="Livestock preview"
            style={{ width: '100%', height: '300px', objectFit: 'cover', display: 'block' }}
          />
          {selectedImage && !scanning && (
            <button
              className="btn btn-secondary"
              onClick={clearImage}
              style={{ position: 'absolute', top: '16px', right: '16px', borderRadius: '50%', padding: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
            >
              <XCircle size={20} color="#e07a5f" />
            </button>
          )}
        </div>

        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p style={{ marginBottom: '20px' }}>Upload or capture a photo of the animal to detect breed.</p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '16px' }}>
            <button
              className="btn btn-secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={scanning}
              style={{ flex: 1 }}
            >
              <Upload size={20} /> Gallery
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => cameraInputRef.current?.click()}
              disabled={scanning}
              style={{ flex: 1 }}
            >
              <Camera size={20} /> Camera
            </button>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleScan}
            disabled={scanning || !selectedFile}
            style={{ width: '100%' }}
          >
            {scanning ? 'Analyzing Image...' : <><Search size={20} /> Scan AI</>}
          </button>
        </div>

        {scanning && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
            <div className="spinner" style={{ width: '60px', height: '60px', border: '5px solid var(--color-secondary)', borderTop: '5px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 1.2s linear infinite' }} />
            <h3 style={{ color: 'var(--color-primary-dark)' }}>Analyzing Image...</h3>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="card" style={{ borderLeft: '4px solid var(--color-accent)', background: '#fff3f0' }}>
          <p style={{ color: '#b05d46' }}>⚠️ {error}</p>
        </div>
      )}

      {/* Results */}
      {result && !scanning && (
        <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <CheckCircle2 color="green" size={28} /> AI Scan Result
          </h2>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1, background: 'var(--color-bg)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Detected Breed</p>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)' }}>{result.breed}</h3>
            </div>
            <div style={{ flex: 1, background: 'var(--color-bg)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Confidence</p>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)' }}>{result.confidence}</h3>
            </div>
          </div>

          {/* Top 5 breeds */}
          {result.top5 && (
            <div style={{ background: 'var(--color-bg)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Top 5 Predictions</p>
              {Object.entries(result.top5).map(([breed, prob]) => (
                <div key={breed} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.9rem' }}>{breed}</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 600 }}>{(prob * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageScanner;
