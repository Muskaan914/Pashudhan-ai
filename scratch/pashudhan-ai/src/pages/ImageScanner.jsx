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

    // Convert to base64 so it can be saved in localStorage
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
      if (data.success) {
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
              Upload a photo of the animal to detect breed and visible diseases.
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