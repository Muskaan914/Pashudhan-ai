// src/pages/FarmerProfile.jsx
import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./FarmerProfile.css";

const BREED_LIST = [
  // Cows
  { breed: "Gir", species: "Cow" },
  { breed: "Sahiwal", species: "Cow" },
  { breed: "Tharparkar", species: "Cow" },
  { breed: "Kankrej", species: "Cow" },
  { breed: "Ongole", species: "Cow" },
  { breed: "Hariana", species: "Cow" },
  { breed: "Rathi", species: "Cow" },
  { breed: "Red Sindhi", species: "Cow" },
  { breed: "Dangi", species: "Cow" },
  { breed: "Deoni", species: "Cow" },
  { breed: "Khillari", species: "Cow" },
  { breed: "Hallikar", species: "Cow" },
  { breed: "Kangayam", species: "Cow" },
  { breed: "Holstein Friesian", species: "Cow" },
  { breed: "Jersey", species: "Cow" },
  { breed: "Ayrshire", species: "Cow" },
  { breed: "Brown Swiss", species: "Cow" },
  // Buffaloes
  { breed: "Murrah", species: "Buffalo" },
  { breed: "Jaffarabadi", species: "Buffalo" },
  { breed: "Nagpuri", species: "Buffalo" },
  { breed: "Surti", species: "Buffalo" },
  { breed: "Nili-Ravi", species: "Buffalo" },
  { breed: "Bhadawari", species: "Buffalo" },
  { breed: "Mehsana", species: "Buffalo" },
  // Goats
  { breed: "Sirohi", species: "Goat" },
  { breed: "Barbari", species: "Goat" },
  { breed: "Beetal", species: "Goat" },
  { breed: "Jamnapari", species: "Goat" },
  { breed: "Black Bengal", species: "Goat" },
  // Others
  { breed: "Bannur", species: "Sheep" },
  { breed: "Deccani", species: "Sheep" },
];

const SPECIES_ICON = { Cow: "🐄", Buffalo: "🐃", Goat: "🐐", Sheep: "🐑" };

function LivestockEntry({ entry, index, onChange, onRemove }) {
  const [search, setSearch] = useState(entry.breed || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef();

  const filtered = BREED_LIST.filter(b =>
    b.breed.toLowerCase().includes(search.toLowerCase()) ||
    b.species.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 8);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setShowDropdown(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function selectBreed(item) {
    setSearch(item.breed);
    setShowDropdown(false);
    onChange(index, { ...entry, breed: item.breed, species: item.species });
  }

  return (
    <div className="livestock-entry">
      <div className="livestock-row" ref={ref}>
        <div className="livestock-search-wrap">
          <span className="ls-icon">{SPECIES_ICON[entry.species] || "🐄"}</span>
          <input
            className="livestock-search-input"
            type="text"
            placeholder="Search breed or species..."
            value={search}
            onChange={e => { setSearch(e.target.value); setShowDropdown(true); onChange(index, { ...entry, breed: e.target.value }); }}
            onFocus={() => setShowDropdown(true)}
          />
          {showDropdown && search.length > 0 && filtered.length > 0 && (
            <div className="breed-dropdown">
              {filtered.map((item, i) => (
                <div key={i} className="breed-option" onMouseDown={() => selectBreed(item)}>
                  <span className="breed-option-icon">{SPECIES_ICON[item.species]}</span>
                  <div>
                    <span className="breed-option-name">{item.breed}</span>
                    <span className="breed-option-species">{item.species}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="ls-count-wrap">
          <button className="ls-count-btn" onClick={() => onChange(index, { ...entry, count: Math.max(1, (entry.count || 1) - 1) })}>−</button>
          <span className="ls-count-val">{entry.count || 1}</span>
          <button className="ls-count-btn" onClick={() => onChange(index, { ...entry, count: (entry.count || 1) + 1 })}>+</button>
        </div>

        <button className="ls-remove-btn" onClick={() => onRemove(index)}>✕</button>
      </div>

      {entry.species && (
        <span className="species-tag">{SPECIES_ICON[entry.species]} {entry.species}</span>
      )}
    </div>
  );
}

export default function FarmerProfile() {
  const [profile, setProfile] = useState({ name: "", phone: "", village: "" });
  const [livestock, setLivestock] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const snap = await getDoc(doc(db, "farmers", "farmer_1"));
        if (snap.exists()) {
          const data = snap.data();
          setProfile({ name: data.name || "", phone: data.phone || "", village: data.village || "" });
          setLivestock(data.livestock || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  function handleChange(index, updated) {
    const newList = [...livestock];
    newList[index] = updated;
    setLivestock(newList);
  }

  function addEntry() {
    setLivestock([...livestock, { breed: "", species: "", count: 1 }]);
  }

  function removeEntry(index) {
    setLivestock(livestock.filter((_, i) => i !== index));
  }

  const totalAnimals = livestock.reduce((sum, l) => sum + (parseInt(l.count) || 0), 0);

  async function handleSave() {
    setSaving(true);
    try {
      await setDoc(doc(db, "farmers", "farmer_1"), {
        ...profile,
        livestock,
        totalAnimals,
      });
      localStorage.setItem("farmerName", profile.name);
      localStorage.setItem("totalAnimals", String(totalAnimals));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert("Error saving: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="profile-container"><p className="loading-text">Loading profile...</p></div>;

  const initials = profile.name
    ? profile.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "F";

  return (
    <div className="profile-container">
      <p className="page-label">My Account</p>
      <h1 className="page-title">Farmer Profile</h1>

      <div className="avatar-section">
        <div className="avatar">{initials}</div>
        <p className="avatar-name">{profile.name || "Your Name"}</p>
        <p className="avatar-village">{profile.village || "Village, District"}</p>
      </div>

      {/* Personal Info */}
      <div className="card">
        <h2 className="card-title">Personal Information</h2>
        <div className="field">
          <label>Full Name</label>
          <input type="text" placeholder="Enter your name" value={profile.name}
            onChange={e => setProfile({ ...profile, name: e.target.value })} />
        </div>
        <div className="field">
          <label>Phone Number</label>
          <input type="tel" placeholder="Enter phone number" value={profile.phone}
            onChange={e => setProfile({ ...profile, phone: e.target.value })} />
        </div>
        <div className="field">
          <label>Village / District</label>
          <input type="text" placeholder="e.g. Pune, Maharashtra" value={profile.village}
            onChange={e => setProfile({ ...profile, village: e.target.value })} />
        </div>
      </div>

      {/* Livestock */}
      <div className="card">
        <div className="card-title-row">
          <h2 className="card-title" style={{ margin: 0 }}>My Livestock</h2>
          <span className="total-badge">{totalAnimals} total</span>
        </div>

        {livestock.length === 0 && (
          <p className="empty-livestock">No livestock added yet. Tap below to add.</p>
        )}

        {livestock.map((entry, i) => (
          <LivestockEntry key={i} entry={entry} index={i} onChange={handleChange} onRemove={removeEntry} />
        ))}

        <button className="add-livestock-btn" onClick={addEntry}>
          + Add Breed
        </button>
      </div>

      {saved && <p className="success-msg">✅ Profile saved successfully!</p>}
      <button className="save-btn" onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "💾 Save Profile"}
      </button>
    </div>
  );
}