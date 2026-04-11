// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWeeklyMilk } from "../services/api";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "./Dashboard.css";

const VACCINE_ALERTS = [
  { name: "FMD Vaccine Due", detail: "Foot & Mouth Disease — all cattle & buffalo", urgency: "urgent", icon: "💉", daysUntil: 3 },
  { name: "HS Vaccine Reminder", detail: "Haemorrhagic Septicaemia — before monsoon", urgency: "warning", icon: "🩺", daysUntil: 15 },
  { name: "BQ Vaccine Due", detail: "Black Quarter — young cattle 6 months–2 years", urgency: "warning", icon: "⚕️", daysUntil: 20 },
  { name: "Deworming Due", detail: "Regular deworming every 3 months", urgency: "info", icon: "💊", daysUntil: 30 },
];

const URGENCY_STYLE = {
  urgent:  { bg: "#FFEBEE", border: "#EF9A9A", color: "#C62828", badge: "Due Now" },
  warning: { bg: "#FFF3E0", border: "#FFCC80", color: "#E65100", badge: "Upcoming" },
  info:    { bg: "#E8F5E9", border: "#A5D6A7", color: "#2D6A4F", badge: "Scheduled" },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [milkToday, setMilkToday]       = useState(null);
  const [totalAnimals, setTotalAnimals] = useState(null);
  const [farmerName, setFarmerName]     = useState("Farmer");
  const [initials, setInitials]         = useState("F");

  useEffect(() => {
    // Load from Firebase
    async function loadProfile() {
      try {
        const snap = await getDoc(doc(db, "farmers", "farmer_1"));
        if (snap.exists()) {
          const data = snap.data();
          if (data.name) {
            setFarmerName(data.name);
            setInitials(data.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2));
            localStorage.setItem("farmerName", data.name);
          }
          if (data.totalAnimals) {
            setTotalAnimals(data.totalAnimals);
            localStorage.setItem("totalAnimals", data.totalAnimals);
          }
        }
      } catch (e) {
        // Fallback to localStorage
        const n = localStorage.getItem("farmerName");
        if (n) { setFarmerName(n); setInitials(n[0]?.toUpperCase() || "F"); }
        const a = localStorage.getItem("totalAnimals");
        if (a) setTotalAnimals(a);
      }
    }

    async function loadMilk() {
      try {
        const data = await getWeeklyMilk();
        if (data.success && data.weekly?.length > 0) {
          const today = data.weekly[data.weekly.length - 1];
          setMilkToday(today?.liters ?? 0);
        }
      } catch (e) {}
    }

    loadProfile();
    loadMilk();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning 🌅" : hour < 17 ? "Good Afternoon ☀️" : "Good Evening 🌙";

  return (
    <div className="dash-container">
      {/* Header */}
      <div className="dash-header">
        <div>
          <p className="dash-greeting">{greeting}</p>
          <h1 className="dash-name">{farmerName}</h1>
        </div>
        <div className="avatar-circle" onClick={() => navigate("/profile")}>
          {initials}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => navigate("/profile")}>
          <span className="stat-icon">🐄</span>
          <p className="stat-val">{totalAnimals ?? "—"}</p>
          <p className="stat-label">Total Livestock</p>
        </div>
        <div className="stat-card" onClick={() => navigate("/milk")}>
          <span className="stat-icon">🥛</span>
          <p className="stat-val">{milkToday !== null ? `${milkToday}L` : "—"}</p>
          <p className="stat-label">Today's Milk</p>
        </div>
      </div>

      {/* Quick Actions */}
      <p className="section-title">Quick Actions</p>
      <div className="quick-grid">
        <QuickAction icon="📚" label="Breed Encyclopedia" color="#E8F5E9" tc="#2D6A4F" onClick={() => navigate("/breeds")} />
        <QuickAction icon="💉" label="Vaccine Guide" color="#FFEBEE" tc="#C62828" onClick={() => navigate("/vaccines")} />
        <QuickAction icon="🔍" label="Scan Animal" color="#E3F2FD" tc="#1565C0" onClick={() => navigate("/scan")} />
        <QuickAction icon="❤️" label="Health Check" color="#FCE4EC" tc="#880E4F" onClick={() => navigate("/health")} />
      </div>

      {/* Vaccine Alerts */}
      <p className="section-title">
        💉 Vaccine Alerts
        <span className="see-all" onClick={() => navigate("/vaccines")}>See all →</span>
      </p>
      {VACCINE_ALERTS.map((alert, i) => {
        const style = URGENCY_STYLE[alert.urgency];
        return (
          <div key={i} className="alert-card" style={{ background: style.bg, borderLeftColor: style.border }} onClick={() => navigate("/vaccines")}>
            <span style={{ fontSize: "22px" }}>{alert.icon}</span>
            <div style={{ flex: 1 }}>
              <p className="alert-name">{alert.name}</p>
              <p className="alert-detail">{alert.detail}</p>
              <p className="alert-days" style={{ color: style.color }}>
                {alert.daysUntil <= 3 ? "🔴" : alert.daysUntil <= 15 ? "🟡" : "🟢"} Due in {alert.daysUntil} days
              </p>
            </div>
            <span className="urgency-badge" style={{ color: style.color }}>{style.badge}</span>
          </div>
        );
      })}

      {/* Today's Tip */}
      <p className="section-title" style={{ marginTop: "20px" }}>💡 Today's Tip</p>
      <div className="tip-banner">
        <p className="tip-text">
          🌡️ It's hot outside! Ensure your animals have shaded areas and plenty of drinking water to maintain milk yield and prevent heat stress.
        </p>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, color, tc, onClick }) {
  return (
    <div className="quick-card" style={{ background: color }} onClick={onClick}>
      <span className="quick-icon">{icon}</span>
      <p className="quick-label" style={{ color: tc }}>{label}</p>
    </div>
  );
}