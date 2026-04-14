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

// ── Real breed photos (free Wikimedia/public domain) ──────────────────────
const BREED_PHOTOS = {
  "Gir":                 "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Gir_cow.jpg/320px-Gir_cow.jpg",
  "Sahiwal":             "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Sahiwal_Bull.jpg/320px-Sahiwal_Bull.jpg",
  "Tharparkar":          "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Tharparkar_cattle.jpg/320px-Tharparkar_cattle.jpg",
  "Kankrej":             "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Kankrej_cattle.jpg/320px-Kankrej_cattle.jpg",
  "Ongole":              "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ongole_cattle.jpg/320px-Ongole_cattle.jpg",
  "Red Sindhi":          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Red_Sindhi_bull.jpg/320px-Red_Sindhi_bull.jpg",
  "Hariana":             "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Hariana_cattle.jpg/320px-Hariana_cattle.jpg",
  "Holstein Friesian":   "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Holstein_Friesian_cow_2_tj.jpg/320px-Holstein_Friesian_cow_2_tj.jpg",
  "Jersey":              "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Jersey_cow_and_calf.jpg/320px-Jersey_cow_and_calf.jpg",
  "Brown Swiss":         "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Brown_Swiss_bull.jpg/320px-Brown_Swiss_bull.jpg",
  "Ayrshire":            "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Ayrshire_cattle_on_pasture.jpg/320px-Ayrshire_cattle_on_pasture.jpg",
  "Guernsey":            "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Guernsey_cattle.jpg/320px-Guernsey_cattle.jpg",
  "Murrah Buffalo":      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Murrah_buffalo.jpg/320px-Murrah_buffalo.jpg",
  "Nili-Ravi Buffalo":   "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Nili-Ravi_buffalo.jpg/320px-Nili-Ravi_buffalo.jpg",
  "Surti Buffalo":       "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Surti_buffalo.jpg/320px-Surti_buffalo.jpg",
  "Jaffarabadi Buffalo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Jaffarabadi_buffalo.jpg/320px-Jaffarabadi_buffalo.jpg",
  "Mehsana Buffalo":     "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Mehsana_buffalo.jpg/320px-Mehsana_buffalo.jpg",
  "Bhadawari Buffalo":   "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Bhadawari_buffalo.jpg/320px-Bhadawari_buffalo.jpg",
};

const TYPE_FALLBACK = {
  "Cow":         "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Holstein_Friesian_cow_2_tj.jpg/320px-Holstein_Friesian_cow_2_tj.jpg",
  "Buffalo":     "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Murrah_buffalo.jpg/320px-Murrah_buffalo.jpg",
  "Cow/Buffalo": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Holstein_Friesian_cow_2_tj.jpg/320px-Holstein_Friesian_cow_2_tj.jpg",
};

function getPhoto(breedName, type) {
  return BREED_PHOTOS[breedName] || TYPE_FALLBACK[type] || TYPE_FALLBACK["Cow"];
}

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

      {/* ── Header ── */}
      <div className="enc-header-bg">
        <p className="page-label">Knowledge Base</p>
        <h1 className="page-title">Breed Encyclopedia</h1>
      </div>

      {/* ── Search ── */}
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

      {/* ── Filter tabs ── */}
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

      {/* ── Breed Cards ── */}
      <div className="breed-grid">
        {filtered.map(breed => {
          const ts    = TYPE_COLORS[breed.type] || TYPE_COLORS["Cow"];
          const photo = getPhoto(breed.breed, breed.type);
          return (
            <div
              key={breed.breed}
              className="breed-card"
              onClick={() => setSelected(breed)}
            >
              {/* Photo thumbnail */}
              <div className="breed-photo-wrap" style={{ background: ts.bg }}>
                <img
                  src={photo}
                  alt={breed.breed}
                  className="breed-photo"
                  onError={e => {
                    e.target.style.display = "none";
                    e.target.parentNode.querySelector(".breed-photo-fallback").style.display = "flex";
                  }}
                />
                <div className="breed-photo-fallback" style={{ display: "none" }}>
                  <span style={{ fontSize: "28px" }}>{ts.icon}</span>
                </div>
              </div>

              <div className="breed-card-body">
                <p className="breed-name">{breed.breed}</p>
                <p className="breed-origin">📍 {breed.origin}</p>
                <div className="breed-tags">
                  <span className="breed-tag" style={{ background: ts.bg, color: ts.color }}>
                    {breed.type}
                  </span>
                  <span className="breed-tag milk-tag">🥛 {breed.milk_yield}</span>
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
          <p style={{ fontSize: "16px", color: "#888", fontWeight: "700" }}>No breeds found</p>
          <p style={{ fontSize: "13px", color: "#aaa" }}>Try a different search term</p>
        </div>
      )}

      <div style={{ height: "80px" }} />
    </div>
  );
}

// ── Breed Detail ──────────────────────────────────────────────────────────
function BreedDetail({ breed, onBack }) {
  const ts    = TYPE_COLORS[breed.type] || TYPE_COLORS["Cow"];
  const hs    = HEAT_COLORS[breed.heat_tolerance] || HEAT_COLORS["Good"];
  const photo = getPhoto(breed.breed, breed.type);

  return (
    <div className="enc-container">
      <button className="back-btn" onClick={onBack}>← Back to Encyclopedia</button>

      {/* ── Hero photo banner ── */}
      <div className="detail-hero-photo">
        <img
          src={photo}
          alt={breed.breed}
          className="detail-hero-img"
          onError={e => { e.target.src = TYPE_FALLBACK[breed.type]; }}
        />
        <div className="detail-hero-overlay">
          <h1 className="detail-breed-name">{breed.breed}</h1>
          <p className="detail-origin">📍 {breed.origin}</p>
          <div className="detail-badges">
            <span className="badge badge-white" style={{ color: ts.color }}>
              {ts.icon} {breed.type}
            </span>
            <span className="badge" style={{ background: hs.bg, color: hs.color }}>
              🌡️ {breed.heat_tolerance}
            </span>
          </div>
        </div>
      </div>

      {/* ── Model accuracy bar ── */}
      <div className="accuracy-bar-wrap">
        <div className="accuracy-bar-header">
          <span>Model Accuracy</span>
          <span className="accuracy-pct">{breed.modelAccuracy}%</span>
        </div>
        <div className="accuracy-track">
          <div className="accuracy-fill" style={{ width: `${breed.modelAccuracy}%` }} />
        </div>
      </div>

      {/* ── Parameters ── */}
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

      {/* ── Health ── */}
      <div className="detail-section">
        <h2 className="section-title">🏥 Health Profile</h2>
        <div className="detail-card">
          <p className="health-status-text">✅ {breed.health_status}</p>
          <p className="detail-text">{breed.health_details}</p>
        </div>
      </div>

      {/* ── Care tip ── */}
      {breed.tip && (
        <div className="detail-section">
          <h2 className="section-title">💡 Care Tip</h2>
          <div className="tip-card">
            <p className="detail-text">{breed.tip}</p>
          </div>
        </div>
      )}

      {/* ── Vaccines ── */}
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
    { name: "FMD (Foot & Mouth)",               schedule: "Every 6 months",            color: "#FFEBEE", tc: "#C62828", forAll: true },
    { name: "HS (Haemorrhagic Septicaemia)",     schedule: "Annually (before monsoon)", color: "#FFF3E0", tc: "#E65100", forAll: true },
    { name: "BQ (Black Quarter)",                schedule: "Annually",                  color: "#F3E5F5", tc: "#6A1B9A", forCow: true },
    { name: "Brucellosis",                       schedule: "Once (calves 4–8 months)",  color: "#E8F5E9", tc: "#2D6A4F", forCow: true },
    { name: "Theileriosis (ECF)",                schedule: "Once in lifetime",          color: "#E3F2FD", tc: "#1565C0", forCow: true },
    { name: "Anthrax",                           schedule: "Annually (endemic areas)",  color: "#FFF8E1", tc: "#F57F17", forAll: true },
    { name: "LSD (Lumpy Skin Disease)",          schedule: "Annually",                  color: "#FCE4EC", tc: "#880E4F", forCow: true },
    { name: "Surra (Trypanosomiasis)",           schedule: "As needed",                 color: "#E0F2F1", tc: "#00695C", forBuffalo: true },
  ].filter(v => v.forAll || (isCow && v.forCow) || (isBuffalo && v.forBuffalo));

  return (
    <div>
      {vaccines.map((v, i) => (
        <div key={i} className="vaccine-row" style={{ borderLeftColor: v.tc }}>
          <div>
            <p className="vaccine-name">{v.name}</p>
            <p className="vaccine-schedule">📅 {v.schedule}</p>
          </div>
          <span className="vaccine-badge" style={{ background: v.color, color: v.tc }}>Due</span>
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