// src/pages/ScanPage.jsx
import { useState, useRef } from "react";
import { scanAnimal } from "../services/api";
import "./ImageScanner.css";

export default function ScanPage() {
  const [imageFile, setImageFile]   = useState(null);
  const [preview, setPreview]       = useState(null);
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState(null);
  const [error, setError]           = useState("");
  const fileInputRef                = useRef();

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError("");
  }

  async function handleScan() {
    if (!imageFile) { setError("Please select an image first."); return; }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const data = await scanAnimal(imageFile);
      if (data.success) setResult(data);
      else setError(data.error || "Scan failed. Try again.");
    } catch (e) {
      setError("Network error: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  const healthColor = result?.health_status === "Healthy" ? "#2D6A4F" : "#E76F51";

  return (
    <div className="page-container">
      <p className="page-label">AI Vision</p>
      <h1 className="page-title">Livestock Scanner</h1>

      {/* Image Preview Box */}
      <div className="image-box" onClick={() => fileInputRef.current.click()}>
        {preview ? (
          <img src={preview} alt="Selected animal" className="preview-img" />
        ) : (
          <div className="placeholder">
            <span className="placeholder-icon">🐄</span>
            <p className="placeholder-text">
              Upload a photo of the animal to detect breed and visible diseases.
            </p>
            <p className="placeholder-hint">Click to select image</p>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Buttons */}
      <div className="btn-row">
        <button
          className="outline-btn"
          onClick={() => fileInputRef.current.click()}
        >
          ⬆ Gallery
        </button>
        {preview && (
          <button className="outline-btn" onClick={() => {
            setPreview(null); setImageFile(null); setResult(null);
          }}>
            ✕ Clear
          </button>
        )}
      </div>

      {error && <p className="error-msg">{error}</p>}

      <button
        className="primary-btn"
        onClick={handleScan}
        disabled={loading || !imageFile}
      >
        {loading ? (
          <span className="spinner-wrap"><span className="spinner" /> Scanning...</span>
        ) : (
          "🔍 Scan AI"
        )}
      </button>

      {/* Results */}
      {result && (
        <div className="card result-card">
          <div className="result-header">
            <span className="result-check">✅</span>
            <span className="result-title">AI Scan Result</span>
          </div>

          <div className="info-grid">
            <div className="info-box">
              <p className="info-label">Detected Breed</p>
              <p className="info-value">{result.breed?.replace(/_/g, " ")}</p>
            </div>
            <div className="info-box">
              <p className="info-label">Confidence</p>
              <p className="info-value">{result.confidence}%</p>
            </div>
          </div>

          <div className="health-box">
            <p className="info-label">Health Status</p>
            <p className="health-status" style={{ color: healthColor }}>
              {result.health_status}
            </p>
            <p className="health-details">{result.health_details}</p>
          </div>
        </div>
      )}
    </div>
  );
}