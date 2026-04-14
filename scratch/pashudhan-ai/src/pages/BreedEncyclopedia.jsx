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

// ✅ UPDATED FULL HD IMAGE MAPPING
const BREED_PHOTOS = {
  "Gir": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Gir_cow.jpg/640px-Gir_cow.jpg",
  "Sahiwal": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Sahiwal_Bull.jpg/640px-Sahiwal_Bull.jpg",
  "Tharparkar": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Tharparkar_cattle.jpg/640px-Tharparkar_cattle.jpg",
  "Kankrej": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Kankrej_cattle.jpg/640px-Kankrej_cattle.jpg",
  "Ongole": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ongole_cattle.jpg/640px-Ongole_cattle.jpg",
  "Hariana": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Hariana_cattle.jpg/640px-Hariana_cattle.jpg",
  "Red Sindhi": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Red_Sindhi_bull.jpg/640px-Red_Sindhi_bull.jpg",

  "Murrah Buffalo": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Murrah_buffalo.jpg/640px-Murrah_buffalo.jpg",
  "Jaffarabadi Buffalo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Jaffarabadi_buffalo.jpg/640px-Jaffarabadi_buffalo.jpg",

  "Holstein Friesian": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Holstein_Friesian_cow_2_tj.jpg/640px-Holstein_Friesian_cow_2_tj.jpg",
  "Jersey": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Jersey_cow_and_calf.jpg/640px-Jersey_cow_and_calf.jpg",
  "Brown Swiss": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Brown_Swiss_bull.jpg/640px-Brown_Swiss_bull.jpg"
};
// fallback
const TYPE_FALLBACK = {
  "Cow": "https://upload.wikimedia.org/wikipedia/commons/0/0a/Holstein_Friesian_cow.jpg",
  "Buffalo": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Murrah_buffalo.jpg",
  "Cow/Buffalo": "https://upload.wikimedia.org/wikipedia/commons/0/0a/Holstein_Friesian_cow.jpg",
};

// ✅ SMART IMAGE HANDLING
function getPhoto(breedName, type) {
  const cleanName = breedName?.trim();

  return (
    BREED_PHOTOS[cleanName] ||
    `https://source.unsplash.com/400x300/?${cleanName},cattle`
  );
}
const ALL_BREEDS = Object.values(BREED_DATABASE);

// ---- REST OF YOUR CODE SAME (NO CHANGE) ----
export default function BreedEncyclopedia() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
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
      {/* SAME UI */}
      <div className="breed-grid">
        {filtered.map(breed => {
          const ts = TYPE_COLORS[breed.type] || TYPE_COLORS["Cow"];
          const photo = getPhoto(breed.breed, breed.type);

          return (
            <div key={breed.breed} className="breed-card" onClick={() => setSelected(breed)}>
              <div className="breed-photo-wrap">
                <img src={photo} alt={breed.breed} className="breed-photo" />
              </div>
              <div className="breed-card-body">
                <p className="breed-name">{breed.breed}</p>
                <p className="breed-origin">📍 {breed.origin}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
// ✅ ADD THIS AT BOTTOM OF FILE

function BreedDetail({ breed, onBack }) {
  const ts = TYPE_COLORS[breed.type] || TYPE_COLORS["Cow"];
  const photo = getPhoto(breed.breed, breed.type);

  return (
    <div className="enc-container">
      <button onClick={onBack} style={{ margin: "10px" }}>
        ← Back to Encyclopedia
      </button>

      {/* ✅ HERO IMAGE */}
      <div style={{ borderRadius: "20px", overflow: "hidden", margin: "10px" }}>
        <img
  src={photo}
  alt={breed.breed}
  className="breed-photo"
  onError={(e) => {
    e.target.src = `https://source.unsplash.com/400x300/?${breed.breed},cow`;
  }}
/>
      </div>

      {/* Breed Info */}
      <div style={{ padding: "15px" }}>
        <h2>{breed.breed}</h2>
        <p>📍 {breed.origin}</p>

        <div style={{ marginTop: "10px" }}>
          <span style={{
            background: ts.bg,
            color: ts.color,
            padding: "6px 12px",
            borderRadius: "20px"
          }}>
            {breed.type}
          </span>
        </div>

        <div style={{ marginTop: "20px" }}>
          <p><b>Milk Yield:</b> {breed.milk_yield}</p>
          <p><b>Fat:</b> {breed.fat_content}</p>
          <p><b>Weight:</b> {breed.weight}</p>
          <p><b>Height:</b> {breed.height}</p>
          <p><b>Lifespan:</b> {breed.lifespan}</p>
        </div>
      </div>
    </div>
  );
}