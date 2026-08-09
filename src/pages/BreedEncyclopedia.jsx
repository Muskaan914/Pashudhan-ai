// src/pages/BreedEncyclopedia.jsx
import { useState } from "react";
import { BREED_DATABASE } from "../services/api";
import "./BreedEncyclopedia.css";



// ── Local breed photos from src/assets/breeds/ ────────────────────────────
const BREED_PHOTOS = {
  "Alambadi":             new URL("../assets/breeds/Alambadi.jpg",       import.meta.url).href,
  "Amritmahal":          new URL("../assets/breeds/Amrit_Mahal.jpg",    import.meta.url).href,
  "Ayrshire":             new URL("../assets/breeds/Ayrshire.jpg",       import.meta.url).href,
  "Banni":                new URL("../assets/breeds/Banni.jpg",          import.meta.url).href,
  "Bargur":               new URL("../assets/breeds/Bargur.jpg",         import.meta.url).href,
  "Bhadawari Buffalo":    new URL("../assets/breeds/Bhadawari.jpg",      import.meta.url).href,
  "Brown Swiss":          new URL("../assets/breeds/Brown_Swiss.jpg",    import.meta.url).href,
  "Dangi":                new URL("../assets/breeds/Dangi.jpg",          import.meta.url).href,
  "Deoni":                new URL("../assets/breeds/Deoni.jpg",          import.meta.url).href,
  "Gir":                  new URL("../assets/breeds/Gir.jpg",            import.meta.url).href,
  "Guernsey":             new URL("../assets/breeds/Guernsey.jpg",       import.meta.url).href,
  "Hallikar":             new URL("../assets/breeds/Hallikar.jpg",       import.meta.url).href,
  "Hariana":              new URL("../assets/breeds/Hariana.jpg",        import.meta.url).href,
  "Holstein Friesian":    new URL("../assets/breeds/Holstein.jpg",       import.meta.url).href,
  "Jaffarabadi Buffalo":  new URL("../assets/breeds/Jaffrabadi.jpg",     import.meta.url).href,
  "Jersey Cow":               new URL("../assets/breeds/Jersey.jpg",         import.meta.url).href,
  "Kangayam":             new URL("../assets/breeds/Kangayam.jpg",       import.meta.url).href,
  "Kankrej":              new URL("../assets/breeds/Kankrej.jpg",        import.meta.url).href,
  "Kasargod":             new URL("../assets/breeds/Kasargod.jpg",       import.meta.url).href,
  "Kenkatha":             new URL("../assets/breeds/Kenkatha.jpg",       import.meta.url).href,
  "Kherigarh":            new URL("../assets/breeds/Kherigarh.jpg",      import.meta.url).href,
  "Khillari":             new URL("../assets/breeds/Khillari.jpg",       import.meta.url).href,
  "Krishna Valley":       new URL("../assets/breeds/Krishna_Valley.jpg", import.meta.url).href,
  "Malnad Gidda":         new URL("../assets/breeds/Malnad_Gidda.jpg",   import.meta.url).href,
  "Murrah Buffalo":       new URL("../assets/breeds/Murrah_Buffalo.jpg", import.meta.url).href,
  "Nagori":               new URL("../assets/breeds/Nagori.jpg",         import.meta.url).href,
  "Nagpuri Buffalo":      new URL("../assets/breeds/Nagpuri.jpg",        import.meta.url).href,
  "Nili-Ravi Buffalo":    new URL("../assets/breeds/Nili_Ravi.jpg",      import.meta.url).href,
  "Nimari":               new URL("../assets/breeds/Nimari.jpg",         import.meta.url).href,
  "Ongole":               new URL("../assets/breeds/Ongole.jpg",         import.meta.url).href,
  "Pulikulam":            new URL("../assets/breeds/Pulikulam.jpg",      import.meta.url).href,
  "Rathi":                new URL("../assets/breeds/Rathi.jpg",          import.meta.url).href,
  "Red Dane":             new URL("../assets/breeds/Red_Dane.jpg",       import.meta.url).href,
  "Red Sindhi":           new URL("../assets/breeds/Red_Sindhi.jpg",     import.meta.url).href,
  "Sahiwal":              new URL("../assets/breeds/Sahiwal.jpg",        import.meta.url).href,
  "Surti Buffalo":        new URL("../assets/breeds/Surti.jpg",          import.meta.url).href,
  "Tharparkar":           new URL("../assets/breeds/Tharparkar.jpg",     import.meta.url).href,
  "Toda":                 new URL("../assets/breeds/Toda.jpg",           import.meta.url).href,
  "Umblachery":           new URL("../assets/breeds/Umblachery.jpg",     import.meta.url).href,
  "Vechur":               new URL("../assets/breeds/Vechur.jpg",         import.meta.url).href,
};

const TYPE_FALLBACK = {
  "Cow":         new URL("../assets/breeds/Holstein.jpg", import.meta.url).href,
  "Buffalo":     new URL("../assets/breeds/Murrah_Buffalo.jpg", import.meta.url).href,
  "Cow/Buffalo": new URL("../assets/breeds/Banni.jpg", import.meta.url).href,
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