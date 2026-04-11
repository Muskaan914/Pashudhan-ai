// src/pages/BreedEncyclopedia.jsx
import { useState } from "react";
import { BREED_DATABASE } from "../services/api";
import "./BreedEncyclopedia.css";

const TYPE_COLORS = {
  "Cow":         { bg: "#E8F5E9", color: "#2D6A4F", icon: "🐄" },
  "Buffalo":     { bg: "#E3F2FD", color: "#1565C0", icon: "🐃" },
  "Cow/Buffalo": { bg: "#FFF3E0", color: "#E65100", icon: "🐂" },
};

const HEAT_COLORS = {
  "Excellent": { bg: "#FFEBEE", color: "#C62828" },
  "Very good": { bg: "#FFF3E0", color: "#E65100" },
  "Good":      { bg: "#E8F5E9", color: "#2D6A4F" },
  "Moderate":  { bg: "#E3F2FD", color: "#1565C0" },
  "Poor":      { bg: "#F3E5F5", color: "#6A1B9A" },
};

const ALL_BREEDS = Object.values(BREED_DATABASE);

export default function BreedEncyclopedia() {
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = ALL_BREEDS.filter(b => {
    const matchSearch =
      b.breed.toLowerCase().includes(search.toLowerCase()) ||
      b.origin.toLowerCase().includes(search.toLowerCase()) ||
      b.uses.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || b.type.includes(filter);
    return matchSearch && matchFilter;
  });

  if (selected) {
    return <BreedDetail breed={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="enc-container">
      <p className="page-label">Knowledge Base</p>
      <h1 className="page-title">Breed Encyclopedia</h1>

      {/* Search */}
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search breed, origin, uses..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="clear-search" onClick={() => setSearch("")}>✕</button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="filter-tabs">
        {["All", "Cow", "Buffalo"].map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "All" ? "🐾 All" : f === "Cow" ? "🐄 Cows" : "🐃 Buffaloes"}
            <span className="filter-count">
              {f === "All"
                ? ALL_BREEDS.length
                : ALL_BREEDS.filter(b => b.type.includes(f)).length}
            </span>
          </button>
        ))}
      </div>

      <p className="results-count">
        {filtered.length} breed{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Breed grid */}
      <div className="breed-grid">
        {filtered.map(breed => {
          const typeStyle = TYPE_COLORS[breed.type] || TYPE_COLORS["Cow"];
          return (
            <div
              key={breed.breed}
              className="breed-card"
              onClick={() => setSelected(breed)}
            >
              <div className="breed-icon-wrap" style={{ background: typeStyle.bg }}>
                <span className="breed-icon">{typeStyle.icon}</span>
              </div>
              <div className="breed-card-body">
                <p className="breed-name">{breed.breed}</p>
                <p className="breed-origin">📍 {breed.origin}</p>
                <div className="breed-tags">
                  <span className="breed-tag" style={{ background: typeStyle.bg, color: typeStyle.color }}>
                    {breed.type}
                  </span>
                  <span className="breed-tag milk-tag">
                    🥛 {breed.milk_yield}
                  </span>
                </div>
              </div>
              <span className="breed-arrow">›</span>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="no-results">
          <p style={{ fontSize: "40px" }}>🔍</p>
          <p style={{ fontSize: "16px", color: "#888" }}>No breeds found</p>
          <p style={{ fontSize: "13px", color: "#aaa" }}>Try a different search term</p>
        </div>
      )}

      <div style={{ height: "80px" }} />
    </div>
  );
}

// ── Breed Detail ──────────────────────────────────────────────────────────
function BreedDetail({ breed, onBack }) {
  const typeStyle = TYPE_COLORS[breed.type] || TYPE_COLORS["Cow"];
  const heatStyle = HEAT_COLORS[breed.heat_tolerance] || HEAT_COLORS["Good"];

  return (
    <div className="enc-container">
      <button className="back-btn" onClick={onBack}>← Back to Encyclopedia</button>

      {/* Hero */}
      <div className="detail-hero" style={{ background: typeStyle.bg }}>
        <span className="detail-icon">{typeStyle.icon}</span>
        <div>
          <h1 className="detail-breed-name">{breed.breed}</h1>
          <p className="detail-origin">📍 {breed.origin}</p>
          <div className="detail-badges">
            <span className="badge" style={{ background: "#fff", color: typeStyle.color, border: `1.5px solid ${typeStyle.color}` }}>
              {breed.type}
            </span>
            <span className="badge" style={{ background: heatStyle.bg, color: heatStyle.color }}>
              🌡️ {breed.heat_tolerance}
            </span>
          </div>
        </div>
      </div>

      {/* Model accuracy bar */}
      <div className="accuracy-bar-wrap">
        <div className="accuracy-bar-header">
          <span>Model Accuracy</span>
          <span className="accuracy-pct">{breed.modelAccuracy}%</span>
        </div>
        <div className="accuracy-track">
          <div className="accuracy-fill" style={{ width: `${breed.modelAccuracy}%` }} />
        </div>
      </div>

      {/* Parameters */}
      <div className="detail-section">
        <h2 className="section-title">📊 Breed Parameters</h2>
        <div className="param-grid">
          <ParamCard icon="🥛" label="Milk Yield"   value={breed.milk_yield} />
          <ParamCard icon="🧈" label="Fat Content"  value={breed.fat_content} />
          <ParamCard icon="⚖️" label="Body Weight"  value={breed.weight} />
          <ParamCard icon="📏" label="Height"        value={breed.height} />
          <ParamCard icon="📅" label="Lifespan"      value={breed.lifespan} />
          <ParamCard icon="🎨" label="Color"         value={breed.color} />
          <ParamCard icon="🔱" label="Horns"         value={breed.horns} />
          <ParamCard icon="🎯" label="Primary Uses"  value={breed.uses} />
        </div>
      </div>

      {/* Health */}
      <div className="detail-section">
        <h2 className="section-title">🏥 Health Profile</h2>
        <div className="detail-card">
          <p className="health-status-text">✅ {breed.health_status}</p>
          <p className="detail-text">{breed.health_details}</p>
        </div>
      </div>

      {/* Care tip */}
      {breed.tip && (
        <div className="detail-section">
          <h2 className="section-title">💡 Care Tip</h2>
          <div className="tip-card">
            <p className="detail-text">{breed.tip}</p>
          </div>
        </div>
      )}

      {/* Vaccines */}
      <div className="detail-section">
        <h2 className="section-title">💉 Recommended Vaccines</h2>
        <BreedVaccines breedType={breed.type} />
      </div>

      <div style={{ height: "80px" }} />
    </div>
  );
}

function BreedVaccines({ breedType }) {
  const isCow     = breedType.includes("Cow");
  const isBuffalo = breedType.includes("Buffalo");

  const vaccines = [
    { name: "FMD (Foot & Mouth)",                schedule: "Every 6 months",              color: "#FFEBEE", tc: "#C62828", forAll: true },
    { name: "HS (Haemorrhagic Septicaemia)",      schedule: "Annually (before monsoon)",   color: "#FFF3E0", tc: "#E65100", forAll: true },
    { name: "BQ (Black Quarter)",                 schedule: "Annually",                    color: "#F3E5F5", tc: "#6A1B9A", forCow: true },
    { name: "Brucellosis",                        schedule: "Once (calves 4–8 months)",    color: "#E8F5E9", tc: "#2D6A4F", forCow: true },
    { name: "Theileriosis (ECF)",                 schedule: "Once in lifetime",            color: "#E3F2FD", tc: "#1565C0", forCow: true },
    { name: "Anthrax",                            schedule: "Annually (endemic areas)",    color: "#FFF8E1", tc: "#F57F17", forAll: true },
    { name: "LSD (Lumpy Skin Disease)",           schedule: "Annually",                    color: "#FCE4EC", tc: "#880E4F", forCow: true },
    { name: "Surra (Trypanosomiasis)",            schedule: "As needed",                   color: "#E0F2F1", tc: "#00695C", forBuffalo: true },
  ].filter(v => v.forAll || (isCow && v.forCow) || (isBuffalo && v.forBuffalo));

  return (
    <div>
      {vaccines.map((v, i) => (
        <div key={i} className="vaccine-row" style={{ borderLeftColor: v.tc }}>
          <div>
            <p className="vaccine-name">{v.name}</p>
            <p className="vaccine-schedule">📅 {v.schedule}</p>
          </div>
          <span className="vaccine-badge" style={{ background: v.color, color: v.tc }}>
            Due
          </span>
        </div>
      ))}
    </div>
  );
}

function ParamCard({ icon, label, value }) {
  return (
    <div className="param-card">
      <p className="param-label">{icon} {label}</p>
      <p className="param-value">{value || "—"}</p>
    </div>
  );
}