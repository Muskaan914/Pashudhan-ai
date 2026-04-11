// src/pages/VaccineInfo.jsx
import { useState } from "react";
import "./VaccineInfo.css";

const ALL_VACCINES = [
  {
    name: "FMD (Foot & Mouth Disease)",
    short: "FMD",
    color: "#FFEBEE", tc: "#C62828",
    icon: "💉",
    animals: "Cattle, Buffalo, Goat, Sheep, Pig",
    schedule: "Every 6 months (April & October)",
    age: "Calves from 4 months",
    dosage: "2 mL subcutaneous injection",
    importance: "Most important vaccine — FMD spreads rapidly and causes huge economic loss",
    symptoms_prevented: "Blisters on mouth, tongue, hooves — leads to lameness and reduced milk",
    brand: "Raksha FMD, Aftovax, Biovac FMD",
    priority: "Critical",
  },
  {
    name: "HS (Haemorrhagic Septicaemia)",
    short: "HS",
    color: "#FFF3E0", tc: "#E65100",
    icon: "🩺",
    animals: "Cattle, Buffalo",
    schedule: "Annually before monsoon (May–June)",
    age: "From 6 months onwards",
    dosage: "2 mL subcutaneous injection",
    importance: "Fatal disease especially during monsoon. Kills animals within 24–48 hours if untreated",
    symptoms_prevented: "High fever, swelling of throat, respiratory distress, sudden death",
    brand: "HS Vaccine (Govt), Raksha HS",
    priority: "Critical",
  },
  {
    name: "BQ (Black Quarter)",
    short: "BQ",
    color: "#F3E5F5", tc: "#6A1B9A",
    icon: "⚕️",
    animals: "Cattle (especially young cattle 6 months – 2 years)",
    schedule: "Annually before monsoon",
    age: "6 months to 2 years",
    dosage: "5 mL subcutaneous injection",
    importance: "Rapidly fatal disease in young cattle. Common in rainy season in black soil areas",
    symptoms_prevented: "Sudden lameness, gas-filled swelling in muscles, high fever",
    brand: "BQ Vaccine (Govt), Raksha BQ",
    priority: "High",
  },
  {
    name: "Brucellosis",
    short: "Brucella",
    color: "#E8F5E9", tc: "#2D6A4F",
    icon: "🧬",
    animals: "Female Cattle & Buffalo (heifers only)",
    schedule: "Once in lifetime (at 4–8 months age)",
    age: "Female calves 4–8 months only",
    dosage: "2 mL subcutaneous injection",
    importance: "Prevents abortion storms and infertility in females. Major economic loss preventer",
    symptoms_prevented: "Abortion in last trimester, infertility, retained placenta",
    brand: "Brucella Abortus S19, RB51",
    priority: "High",
  },
  {
    name: "Anthrax",
    short: "Anthrax",
    color: "#FFF8E1", tc: "#F57F17",
    icon: "🦠",
    animals: "Cattle, Buffalo, Sheep, Goat",
    schedule: "Annually (in endemic/flood-prone areas)",
    age: "From 6 months",
    dosage: "1 mL subcutaneous injection",
    importance: "Zoonotic disease — can spread to humans. Mandatory in flood/endemic areas",
    symptoms_prevented: "Sudden death, bloody discharge from body openings",
    brand: "Anthrax Spore Vaccine (Govt)",
    priority: "High",
  },
  {
    name: "LSD (Lumpy Skin Disease)",
    short: "LSD",
    color: "#FCE4EC", tc: "#880E4F",
    icon: "🔬",
    animals: "Cattle only",
    schedule: "Annually",
    age: "From 4 months",
    dosage: "1 mL subcutaneous injection",
    importance: "Spreading rapidly across India. Causes skin lumps, reduced milk, death in severe cases",
    symptoms_prevented: "Lumps on skin, high fever, reduced milk yield, swollen lymph nodes",
    brand: "Lumpi-ProVacInd (ICAR), Lumpy skin vaccine",
    priority: "High",
  },
  {
    name: "Theileriosis (ECF)",
    short: "Theileria",
    color: "#E3F2FD", tc: "#1565C0",
    icon: "🧪",
    animals: "Cattle (especially crossbred/exotic breeds)",
    schedule: "Once in lifetime",
    age: "3–6 months",
    dosage: "2 mL + anti-theilerial drug",
    importance: "Deadly tick-borne disease. Exotic/crossbred cows are highly susceptible",
    symptoms_prevented: "High fever, swollen lymph nodes, anemia, jaundice, death",
    brand: "Theilvac, Raksha ECF",
    priority: "Medium",
  },
  {
    name: "Rabies",
    short: "Rabies",
    color: "#E0F2F1", tc: "#00695C",
    icon: "💊",
    animals: "All cattle and buffalo (dog-bite endemic areas)",
    schedule: "After bite + annual booster in endemic areas",
    age: "Any age after bite",
    dosage: "2 mL intramuscular",
    importance: "Fatal and zoonotic. Give immediately after dog/wild animal bite",
    symptoms_prevented: "Aggression, paralysis, death",
    brand: "Nobivac Rabies, Rabisin",
    priority: "Medium",
  },
  {
    name: "PPR (Peste des Petits Ruminants)",
    short: "PPR",
    color: "#E8EAF6", tc: "#283593",
    icon: "🐐",
    animals: "Goat, Sheep",
    schedule: "Every 3 years",
    age: "From 3 months",
    dosage: "1 mL subcutaneous",
    importance: "Highly contagious disease in small ruminants. 100% fatal in some outbreaks",
    symptoms_prevented: "High fever, mouth ulcers, diarrhea, pneumonia, death",
    brand: "PPR Vaccine (Govt), Raksha PPR",
    priority: "Critical for goats",
  },
];

const PRIORITY_COLORS = {
  "Critical":          { bg: "#FFEBEE", color: "#C62828" },
  "High":              { bg: "#FFF3E0", color: "#E65100" },
  "Medium":            { bg: "#E8F5E9", color: "#2D6A4F" },
  "Critical for goats":{ bg: "#F3E5F5", color: "#6A1B9A" },
};

export default function VaccineInfo() {
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = ALL_VACCINES.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.animals.toLowerCase().includes(search.toLowerCase()) ||
    v.short.toLowerCase().includes(search.toLowerCase())
  );

  if (selected) {
    return <VaccineDetail vaccine={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="vac-container">
      <p className="page-label">Health Management</p>
      <h1 className="page-title">Vaccine Guide</h1>

      {/* Annual schedule reminder */}
      <div className="schedule-banner">
        <span style={{ fontSize: "20px" }}>📅</span>
        <div>
          <p className="banner-title">Annual Vaccination Schedule</p>
          <p className="banner-sub">Keep all vaccines up to date for healthy livestock</p>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search vaccine or animal type..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && <button className="clear-search" onClick={() => setSearch("")}>✕</button>}
      </div>

      {/* Vaccine list */}
      <div className="vac-list">
        {filtered.map((v, i) => {
          const priStyle = PRIORITY_COLORS[v.priority] || PRIORITY_COLORS["Medium"];
          return (
            <div key={i} className="vac-card" onClick={() => setSelected(v)}>
              <div className="vac-icon-wrap" style={{ background: v.color }}>
                <span style={{ fontSize: "22px" }}>{v.icon}</span>
              </div>
              <div className="vac-card-body">
                <p className="vac-name">{v.name}</p>
                <p className="vac-animals">🐄 {v.animals}</p>
                <p className="vac-schedule">📅 {v.schedule}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                <span className="priority-badge" style={{ background: priStyle.bg, color: priStyle.color }}>
                  {v.priority}
                </span>
                <span className="vac-arrow">›</span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="no-results">
          <p style={{ fontSize: "40px" }}>💉</p>
          <p style={{ fontSize: "16px", color: "#888" }}>No vaccines found</p>
        </div>
      )}
    </div>
  );
}

// ── Vaccine Detail ────────────────────────────────────────────────────────
function VaccineDetail({ vaccine: v, onBack }) {
  const priStyle = PRIORITY_COLORS[v.priority] || PRIORITY_COLORS["Medium"];

  return (
    <div className="vac-container">
      <button className="back-btn" onClick={onBack}>← Back to Vaccine Guide</button>

      <div className="vac-hero" style={{ background: v.color }}>
        <span style={{ fontSize: "40px" }}>{v.icon}</span>
        <div>
          <h1 className="detail-name">{v.name}</h1>
          <span className="priority-badge" style={{ background: priStyle.bg, color: priStyle.color }}>
            {v.priority} Priority
          </span>
        </div>
      </div>

      <InfoRow icon="🐄" label="For Animals" value={v.animals} />
      <InfoRow icon="📅" label="Schedule" value={v.schedule} />
      <InfoRow icon="🧒" label="Age to Vaccinate" value={v.age} />
      <InfoRow icon="💉" label="Dosage" value={v.dosage} />
      <InfoRow icon="🏥" label="Available Brands" value={v.brand} />

      <div className="detail-card-vac">
        <p className="detail-label">⚠️ Why it's Important</p>
        <p className="detail-text">{v.importance}</p>
      </div>

      <div className="detail-card-vac" style={{ borderLeftColor: "#C62828" }}>
        <p className="detail-label">🛡️ Diseases Prevented</p>
        <p className="detail-text">{v.symptoms_prevented}</p>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="info-row">
      <span className="info-icon">{icon}</span>
      <div>
        <p className="info-label">{label}</p>
        <p className="info-value">{value}</p>
      </div>
    </div>
  );
}