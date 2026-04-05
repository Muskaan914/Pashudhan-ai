// src/pages/FarmerProfile.jsx
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./FarmerProfile.css";

export default function FarmerProfile() {
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    village: "",
    totalAnimals: "",
    cows: "",
    buffaloes: "",
    goats: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load profile on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const docRef = doc(db, "farmers", "farmer_1");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await setDoc(doc(db, "farmers", "farmer_1"), profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert("Error saving: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="profile-container"><p className="loading-text">Loading profile...</p></div>;

  return (
    <div className="profile-container">
      <p className="page-label">My Account</p>
      <h1 className="page-title">Farmer Profile</h1>

      <div className="avatar-section">
        <div className="avatar">
          {profile.name ? profile.name[0].toUpperCase() : "F"}
        </div>
        <p className="avatar-name">{profile.name || "Your Name"}</p>
        <p className="avatar-village">{profile.village || "Village, District"}</p>
      </div>

      <div className="card">
        <h2 className="card-title">Personal Information</h2>

        <div className="field">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={profile.name}
            onChange={e => setProfile({...profile, name: e.target.value})}
          />
        </div>

        <div className="field">
          <label>Phone Number</label>
          <input
            type="tel"
            placeholder="Enter phone number"
            value={profile.phone}
            onChange={e => setProfile({...profile, phone: e.target.value})}
          />
        </div>

        <div className="field">
          <label>Village / District</label>
          <input
            type="text"
            placeholder="e.g. Pune, Maharashtra"
            value={profile.village}
            onChange={e => setProfile({...profile, village: e.target.value})}
          />
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Livestock Information</h2>

        <div className="field">
          <label>Total Animals</label>
          <input
            type="number"
            placeholder="Total number of animals"
            value={profile.totalAnimals}
            onChange={e => setProfile({...profile, totalAnimals: e.target.value})}
          />
        </div>

        <div className="animal-grid">
          <div className="animal-card">
            <span className="animal-icon">🐄</span>
            <label>Cows</label>
            <input
              type="number"
              placeholder="0"
              value={profile.cows}
              onChange={e => setProfile({...profile, cows: e.target.value})}
            />
          </div>
          <div className="animal-card">
            <span className="animal-icon">🐃</span>
            <label>Buffaloes</label>
            <input
              type="number"
              placeholder="0"
              value={profile.buffaloes}
              onChange={e => setProfile({...profile, buffaloes: e.target.value})}
            />
          </div>
          <div className="animal-card">
            <span className="animal-icon">🐐</span>
            <label>Goats</label>
            <input
              type="number"
              placeholder="0"
              value={profile.goats}
              onChange={e => setProfile({...profile, goats: e.target.value})}
            />
          </div>
        </div>
      </div>

      {saved && <p className="success-msg">✅ Profile saved successfully!</p>}

      <button className="save-btn" onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "💾 Save Profile"}
      </button>
    </div>
  );
}