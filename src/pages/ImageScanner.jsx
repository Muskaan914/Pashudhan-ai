// src/pages/ScanPage.jsx
import { useState, useRef, useEffect } from "react";
import { scanAnimal } from "../services/api";
import buffaloImg from "../assets/buffalo.png";
import "./ImageScanner.css";

export default function ScanPage() {
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview]     = useState(null);
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState(null);
  const [error, setError]         = useState("");
  const fileInputRef              = useRef();

  // Load last scan result AND preview on mount
  useEffect(() => {
    try {
      const savedResult = localStorage.getItem("lastScanResult");
      if (savedResult) setResult(JSON.parse(savedResult));
      const savedPreview = localStorage.getItem("lastScanPreview");
      if (savedPreview) setPreview(savedPreview);
    } catch (e) {}
  }, []);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setResult(null);
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      setPreview(base64);
      localStorage.setItem("lastScanPreview", base64);
    };
    reader.readAsDataURL(file);
  }

  async function handleScan() {
    if (!imageFile) { setError("Please select an image first."); return; }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const data = await scanAnimal(imageFile);
      if (data.invalid) {
        setError(data.error);
        localStorage.removeItem("lastScanResult");
      } else if (data.success) {
        setResult(data);
        localStorage.setItem("lastScanResult", JSON.stringify(data));
      } else {
        setError(data.error || "Scan failed. Try again.");
      }
    } catch (e) {
      setError("Network error: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setPreview(null);
    setImageFile(null);
    setResult(null);
    setError("");
    localStorage.removeItem("lastScanPreview");
    localStorage.removeItem("lastScanResult");
  }

  const healthColor = result?.health_status === "Healthy" ? "#2D6A4F" : "#E76F51";

  return (
    <div className="page-container">
      <p className="page-label">AI Vision</p>
      <h1 className="page-title">Livestock Scanner</h1>

      <div className="image-box" onClick={() => fileInputRef.current.click()}>
        {preview ? (
          <img src={preview} alt="Selected animal" className="preview-img" />
        ) : (
          <div className="placeholder">
            <img src={buffaloImg} alt="cow" className="full-placeholder-image" />
            <p className="placeholder-text overlay">
              Upload a photo of cattle or buffalo to detect breed and health.
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div className="btn-row">
        <button className="outline-btn" onClick={() => fileInputRef.current.click()}>
          ⬆ Gallery
        </button>
        {preview && (
          <button className="outline-btn" onClick={handleClear}>
            ✕ Clear
          </button>
        )}
      </div>

      {error && (
        <div style={{ background: "#FFEBEE", border: "1px solid #FFCDD2", borderRadius: "12px", padding: "14px", marginBottom: "12px", color: "#C62828", fontSize: "14px", fontWeight: "600" }}>
          {error}
        </div>
      )}

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

      {/* ── Full Result Card ── */}
      {result && (
        <div className="card result-card">
          {/* Header */}
          <div className="result-header">
            <span className="result-check">✅</span>
            <div>
              <span className="result-title">{result.breed}</span>
              <span style={{ display: "block", fontSize: "12px", color: "#888", marginTop: "2px" }}>
                {result.type} • {result.origin}
              </span>
            </div>
          </div>

          {/* Confidence + Model Accuracy */}
          <div className="info-grid">
            <div className="info-box">
              <p className="info-label">AI Confidence</p>
              <p className="info-value" style={{ color: "#2D6A4F" }}>{result.confidence}%</p>
            </div>
            <div className="info-box">
              <p className="info-label">Model Accuracy</p>
              <p className="info-value" style={{ color: "#0077b6" }}>{result.modelAccuracy}%</p>
            </div>
          </div>

          {/* Breed Parameters */}
          <div style={{ marginBottom: "12px" }}>
            <p style={{ fontSize: "13px", fontWeight: "700", color: "#1B3A2F", marginBottom: "10px" }}>📊 Breed Parameters</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <ParamBox icon="🥛" label="Milk Yield" value={result.milk_yield} />
              <ParamBox icon="🧈" label="Fat Content" value={result.fat_content} />
              <ParamBox icon="⚖️" label="Body Weight" value={result.weight} />
              <ParamBox icon="📏" label="Height" value={result.height} />
              <ParamBox icon="📅" label="Lifespan" value={result.lifespan} />
              <ParamBox icon="🌡️" label="Heat Tolerance" value={result.heat_tolerance} />
            </div>
          </div>

          {/* Color & Horns */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
            <ParamBox icon="🎨" label="Color" value={result.color} />
            <ParamBox icon="🔱" label="Horns" value={result.horns} />
          </div>

          {/* Uses */}
          <div style={{ background: "#F0F7F4", borderRadius: "10px", padding: "10px 12px", marginBottom: "12px" }}>
            <p style={{ fontSize: "11px", color: "#888", marginBottom: "4px" }}>PRIMARY USES</p>
            <p style={{ fontSize: "14px", fontWeight: "600", color: "#1B3A2F" }}>🎯 {result.uses}</p>
          </div>

          {/* Health Status */}
          <div className="health-box">
            <p className="info-label">Health Status</p>
            <p className="health-status" style={{ color: healthColor }}>
              {result.health_status}
            </p>
            <p className="health-details">{result.health_details}</p>
          </div>

          {/* Today's Tip */}
          {result.tip && (
            <div style={{ background: "#FFF8E1", borderRadius: "10px", padding: "12px", marginTop: "10px", borderLeft: "4px solid #FFC107" }}>
              <p style={{ fontSize: "11px", color: "#888", marginBottom: "4px" }}>💡 CARE TIP</p>
              <p style={{ fontSize: "13px", color: "#5D4037", lineHeight: "1.5" }}>{result.tip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ParamBox({ icon, label, value }) {
  return (
    <div style={{ background: "#F5F0E8", borderRadius: "10px", padding: "10px" }}>
      <p style={{ fontSize: "11px", color: "#888", marginBottom: "4px" }}>{icon} {label}</p>
      <p style={{ fontSize: "13px", fontWeight: "600", color: "#1B3A2F" }}>{value || "—"}</p>
    </div>
  );
}