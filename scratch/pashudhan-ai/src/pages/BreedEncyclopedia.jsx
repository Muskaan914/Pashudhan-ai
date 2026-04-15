// src/pages/BreedEncyclopedia.jsx
import { useState } from "react";
import { BREED_DATABASE } from "../services/api";
import "./BreedEncyclopedia.css";

// ── Local breed images from src/assets/breeds/ ───────────────────────────
import img_Alambadi        from "../assets/breeds/Alambadi.jpg";
import img_Amrit_Mahal     from "../assets/breeds/Amrit_Mahal.jpg";
import img_Ayrshire        from "../assets/breeds/Ayrshire.jpg";
import img_Banni           from "../assets/breeds/Banni.jpg";
import img_Bargur          from "../assets/breeds/Bargur.jpg";
import img_Bhadawari       from "../assets/breeds/Bhadawari.jpg";
import img_Brown_Swiss     from "../assets/breeds/Brown_Swiss.jpg";
import img_Dangi           from "../assets/breeds/Dangi.jpg";
import img_Deoni           from "../assets/breeds/Deoni.jpg";
import img_Gir             from "../assets/breeds/Gir.jpg";
import img_Guernsey        from "../assets/breeds/Guernsey.jpg";
import img_Hallikar        from "../assets/breeds/Hallikar.jpg";
import img_Hariana         from "../assets/breeds/Hariana.jpg";
import img_Holstein        from "../assets/breeds/Holstein.jpg";
import img_Jaffrabadi      from "../assets/breeds/Jaffrabadi.jpg";
import img_Jersey          from "../assets/breeds/Jersey.jpg";
import img_Kangayam        from "../assets/breeds/Kangayam.jpg";
import img_Kankrej         from "../assets/breeds/Kankrej.jpg";
import img_Kasargod        from "../assets/breeds/Kasargod.jpg";
import img_Kenkatha        from "../assets/breeds/Kenkatha.jpg";
import img_Kherigarh       from "../assets/breeds/Kherigarh.jpg";
import img_Khillari        from "../assets/breeds/Khillari.jpg";
import img_KrishnaValley   from "../assets/breeds/Krishna_Valley.jpg";
import img_MalnadGidda     from "../assets/breeds/Malnad_Gidda.jpg";
import img_Murrah          from "../assets/breeds/Murrah_Buffalo.jpg";
import img_Nagori          from "../assets/breeds/Nagori.jpg";
import img_Nagpuri         from "../assets/breeds/Nagpuri.jpg";
import img_NiliRavi        from "../assets/breeds/Nili_Ravi.jpg";
import img_Nimari          from "../assets/breeds/Nimari.jpg";
import img_Ongole          from "../assets/breeds/Ongole.jpg";
import img_Pulikulam       from "../assets/breeds/Pulikulam.jpg";
import img_Rathi           from "../assets/breeds/Rathi.jpg";
import img_RedDane         from "../assets/breeds/Red_Dane.jpg";
import img_RedSindhi       from "../assets/breeds/Red_Sindhi.jpg";
import img_Sahiwal         from "../assets/breeds/Sahiwal.jpg";
import img_Surti           from "../assets/breeds/Surti.jpg";
import img_Tharparkar      from "../assets/breeds/Tharparkar.jpg";
import img_Toda            from "../assets/breeds/Toda.jpg";
import img_Umblachery      from "../assets/breeds/Umblachery.jpg";
import img_Vechur          from "../assets/breeds/Vechur.jpg";

// ── breed name in api.js  →  local image ─────────────────────────────────
const BREED_PHOTOS = {
"Alambadi":            img_Alambadi,
"Amrit Mahal":         img_Amrit_Mahal,
"Ayrshire":            img_Ayrshire,
"Banni":               img_Banni,
"Bargur":              img_Bargur,
"Bhadawari Buffalo":   img_Bhadawari,
"Brown Swiss":         img_Brown_Swiss,
"Dangi":               img_Dangi,
"Deoni":               img_Deoni,
"Gir":                 img_Gir,
"Guernsey":            img_Guernsey,
"Hallikar":            img_Hallikar,
"Hariana":             img_Hariana,
"Holstein Friesian":   img_Holstein,
"Jaffarabadi Buffalo": img_Jaffrabadi,
"Jersey":              img_Jersey,
"Kangayam":            img_Kangayam,
"Kankrej":             img_Kankrej,
"Kasargod":            img_Kasargod,
"Kenkatha":            img_Kenkatha,
"Kherigarh":           img_Kherigarh,
"Khillari":            img_Khillari,
"Krishna Valley":      img_KrishnaValley,
"Malnad Gidda":        img_MalnadGidda,
"Murrah Buffalo":      img_Murrah,
"Nagori":              img_Nagori,
"Nagpuri Buffalo":     img_Nagpuri,
"Nili-Ravi Buffalo":   img_NiliRavi,
"Nimari":              img_Nimari,
"Ongole":              img_Ongole,
"Pulikulam":           img_Pulikulam,
"Rathi":               img_Rathi,
"Red Dane":            img_RedDane,
"Red Sindhi":          img_RedSindhi,
"Sahiwal":             img_Sahiwal,
"Surti Buffalo":       img_Surti,
"Tharparkar":          img_Tharparkar,
"Toda":                img_Toda,
"Umblachery":          img_Umblachery,
"Vechur":              img_Vechur
};

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
          const photo = BREED_PHOTOS[breed.breed];
          return (
            <div
              key={breed.breed}
              className="breed-card"
              onClick={() => setSelected(breed)}
            >
              <div className="breed-photo-wrap" style={{ background: ts.bg }}>
                {photo ? (
                  <img src={photo} alt={breed.breed} className="breed-photo" />
                ) : (
                  <div className="breed-photo-fallback">
                    <span style={{ fontSize: "28px" }}>{ts.icon}</span>
                  </div>
                )}
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
  const photo = BREED_PHOTOS[breed.breed];

  return (
    <div className="enc-container">
      <button className="back-btn" onClick={onBack}>← Back to Encyclopedia</button>

      {/* ── Hero — photo if available, coloured card if not ── */}
      {photo ? (
        <div className="detail-hero-photo">
          <img src={photo} alt={breed.breed} className="detail-hero-img" />
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
      ) : (
        <div className="detail-hero-emoji" style={{ background: ts.bg }}>
          <span style={{ fontSize: "64px" }}>{ts.icon}</span>
          <div>
            <h1 className="detail-breed-name" style={{ color: "#1B3A2F" }}>{breed.breed}</h1>
            <p className="detail-origin" style={{ color: "#666" }}>📍 {breed.origin}</p>
            <div className="detail-badges" style={{ marginTop: "8px" }}>
              <span className="badge" style={{ background: "#fff", color: ts.color, border: `1.5px solid ${ts.color}` }}>
                {ts.icon} {breed.type}
              </span>
              <span className="badge" style={{ background: hs.bg, color: hs.color }}>
                🌡️ {breed.heat_tolerance}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Model accuracy ── */}
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
    { name: "FMD (Foot & Mouth)",           schedule: "Every 6 months",            color: "#FFEBEE", tc: "#C62828", forAll: true },
    { name: "HS (Haemorrhagic Septicaemia)",schedule: "Annually (before monsoon)",  color: "#FFF3E0", tc: "#E65100", forAll: true },
    { name: "BQ (Black Quarter)",           schedule: "Annually",                  color: "#F3E5F5", tc: "#6A1B9A", forCow: true },
    { name: "Brucellosis",                  schedule: "Once (calves 4–8 months)",  color: "#E8F5E9", tc: "#2D6A4F", forCow: true },
    { name: "Theileriosis (ECF)",           schedule: "Once in lifetime",          color: "#E3F2FD", tc: "#1565C0", forCow: true },
    { name: "Anthrax",                      schedule: "Annually (endemic areas)",  color: "#FFF8E1", tc: "#F57F17", forAll: true },
    { name: "LSD (Lumpy Skin Disease)",     schedule: "Annually",                  color: "#FCE4EC", tc: "#880E4F", forCow: true },
    { name: "Surra (Trypanosomiasis)",      schedule: "As needed",                 color: "#E0F2F1", tc: "#00695C", forBuffalo: true },
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