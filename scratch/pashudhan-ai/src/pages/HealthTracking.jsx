// src/pages/HealthPage.jsx
import { useState } from "react";
import { analyzeSymptoms } from "../services/api";
import "./HealthPage.css";

const SEVERITY_COLOR = {
  mild:     { bg: "#E8F5E9", color: "#2E7D32" },
  moderate: { bg: "#FFF3E0", color: "#E65100" },
  severe:   { bg: "#FFEBEE", color: "#C62828" },
};

export default function HealthPage() {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState("");

  async function handleAnalyze() {
    if (!symptoms.trim()) { setError("Please enter symptoms first."); return; }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeSymptoms(symptoms);
      if (data.success) setResult(data);
      else setError(data.error || "Analysis failed. Try again.");
    } catch (e) {
      setError("Network error: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  const sevStyle = result ? SEVERITY_COLOR[result.severity] || SEVERITY_COLOR.mild : {};

  return (
    <div className="page-container">
      <p className="page-label">Health Management</p>
      <h1 className="page-title">Livestock Health</h1>

      {/* Symptom Checker Card */}
      <div className="card">
        <h2 className="card-title">AI Symptom Checker</h2>
        <p className="card-sub">Enter observed symptoms (e.g., limping, fever, reduced milk):</p>
        <textarea
          className="symptom-input"
          rows={4}
          placeholder="e.g. My buffalo has blisters on its mouth and is not eating..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />
        {error && <p className="error-msg">{error}</p>}
        <button
          className="primary-btn"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? (
            <span className="spinner-wrap"><span className="spinner" /> Analyzing...</span>
          ) : (
            "⚡ Analyze Symptoms"
          )}
        </button>
      </div>

      {/* Results Card */}
      {result && (
        <div className="card result-card">
          <div
            className="severity-badge"
            style={{ background: sevStyle.bg, color: sevStyle.color }}
          >
            {result.severity?.toUpperCase()} SEVERITY
          </div>

          <Section title="Possible Conditions">
            {result.possible_conditions?.map((c, i) => (
              <p key={i} className="bullet">• {c}</p>
            ))}
          </Section>

          <Section title="Immediate Actions">
            {result.immediate_actions?.map((a, i) => (
              <p key={i} className="bullet">• {a}</p>
            ))}
          </Section>

          {result.medicines?.length > 0 && (
            <Section title="Suggested Medicines">
              {result.medicines.map((m, i) => (
                <p key={i} className="bullet">• {m}</p>
              ))}
            </Section>
          )}

          <Section title="When to Call Vet">
            <p className="body-text">{result.when_to_call_vet}</p>
          </Section>

          <Section title="Prevention">
            <p className="body-text">{result.prevention}</p>
          </Section>
        </div>
      )}

      {/* Health Log */}
      <h2 className="section-header">Recent Health Log</h2>
      <div className="card">
        <LogItem icon="✅" name="Cow #4 (Gauri)"
          event="FMD Vaccination completed" when="2 days ago" />
        <LogItem icon="⚠️" name="Buffalo #2 (Murrah)"
          event="Monitored for low milk yield" when="Yesterday" />
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="result-section">
      <p className="result-section-title">{title}</p>
      {children}
    </div>
  );
}

function LogItem({ icon, name, event, when }) {
  return (
    <div className="log-item">
      <span className="log-icon">{icon}</span>
      <div>
        <p className="log-name">{name}</p>
        <p className="log-event">{event}</p>
        <p className="log-when">{when}</p>
      </div>
    </div>
  );
}