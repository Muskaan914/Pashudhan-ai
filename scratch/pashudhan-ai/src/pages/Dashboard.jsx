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
  urgent:  { bg: "#FFF0F0", border: "#FF6B6B", color: "#C0392B", badge: "Due Now",   dot: "#FF4757" },
  warning: { bg: "#FFFBF0", border: "#FFD93D", color: "#D68910", badge: "Upcoming",  dot: "#FFC312" },
  info:    { bg: "#F0FFF4", border: "#6BCB77", color: "#1E8449", badge: "Scheduled", dot: "#2ECC71" },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [milkToday, setMilkToday]       = useState(null);
  const [totalAnimals, setTotalAnimals] = useState(null);
  const [farmerName, setFarmerName]     = useState("");
  const [initials, setInitials]         = useState("F");

  useEffect(() => {
    async function loadProfile() {
      // Instantly show from cache first
      const cachedName    = localStorage.getItem("farmerName");
      const cachedAnimals = localStorage.getItem("totalAnimals");
      if (cachedName) {
        setFarmerName(cachedName);
        setInitials(cachedName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2));
      }
      if (cachedAnimals) setTotalAnimals(cachedAnimals);

      // Then refresh from Firebase
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
            localStorage.setItem("totalAnimals", String(data.totalAnimals));
          }
        }
      } catch (e) {
        console.error("Firebase load error:", e);
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
  const greeting    = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const greetEmoji  = hour < 12 ? "🌅" : hour < 17 ? "☀️" : "🌙";
  const displayName = farmerName || "Farmer";

  return (
    <div className="dash-container">

      {/* ── Header ── */}
      <div className="dash-header">
        <div className="header-left">
          <p className="dash-greeting">{greeting} {greetEmoji}</p>
          <h1 className="dash-name">{displayName}</h1>
        </div>
        <div className="avatar-circle" onClick={() => navigate("/profile")}>
          {initials}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="stats-row">
        <div className="stat-card" onClick={() => navigate("/profile")}>
          <div className="stat-icon-wrap green">🐄</div>
          <div>
            <p className="stat-val">{totalAnimals ?? "—"}</p>
            <p className="stat-label">Total Livestock</p>
          </div>
        </div>
        <div className="stat-card" onClick={() => navigate("/milk")}>
          <div className="stat-icon-wrap blue">🥛</div>
          <div>
            <p className="stat-val">{milkToday !== null ? `${milkToday}L` : "—"}</p>
            <p className="stat-label">Today's Milk</p>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <p className="section-label">Quick Actions</p>
      <div className="quick-grid">
        <QuickAction icon="📚" label="Breed Encyclopedia" color="#E8F5E9" tc="#2D6A4F" onClick={() => navigate("/breeds")} />
        <QuickAction icon="💉" label="Vaccine Guide"      color="#FFEBEE" tc="#C62828" onClick={() => navigate("/vaccines")} />
        <QuickAction icon="🔍" label="Scan Animal"        color="#E3F2FD" tc="#1565C0" onClick={() => navigate("/scan")} />
        <QuickAction icon="❤️" label="Health Check"       color="#FCE4EC" tc="#880E4F" onClick={() => navigate("/health")} />
      </div>

      {/* ── Vaccine Alerts ── */}
      <div className="section-header">
        <p className="section-label" style={{ margin: 0 }}>💉 Vaccine Alerts</p>
        <span className="see-all" onClick={() => navigate("/vaccines")}>See all →</span>
      </div>

      {VACCINE_ALERTS.map((alert, i) => {
        const style = URGENCY_STYLE[alert.urgency];
        return (
          <div
            key={i}
            className="alert-card"
            style={{ background: style.bg, borderLeftColor: style.border }}
            onClick={() => navigate("/vaccines")}
          >
            <div className="alert-dot" style={{ background: style.dot }} />
            <span className="alert-icon-text">{alert.icon}</span>
            <div className="alert-body">
              <p className="alert-name">{alert.name}</p>
              <p className="alert-detail">{alert.detail}</p>
              <p className="alert-days" style={{ color: style.color }}>
                Due in {alert.daysUntil} day{alert.daysUntil !== 1 ? "s" : ""}
              </p>
            </div>
            <span className="urgency-badge" style={{ color: style.color, borderColor: style.border }}>
              {style.badge}
            </span>
          </div>
        );
      })}

      {/* ── Today's Tip ── */}
      <p className="section-label" style={{ marginTop: "24px" }}>💡 Today's Tip</p>
      <div className="tip-banner">
        <span className="tip-emoji">🌡️</span>
        <p className="tip-text">
          It's hot outside! Ensure your animals have shaded areas and plenty of drinking water to maintain milk yield and prevent heat stress.
        </p>
      </div>

      <div style={{ height: "80px" }} />
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