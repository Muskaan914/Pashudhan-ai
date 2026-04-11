// src/pages/Dashboard.jsx — Updated with vaccine alerts + quick links
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWeeklyMilk } from "../services/api";
import "./Dashboard.css";

// ── Vaccine alert schedule ────────────────────────────────────────────────
const VACCINE_ALERTS = [
  {
    name: "FMD Vaccine Due",
    detail: "Foot & Mouth Disease — give to all cattle & buffalo",
    urgency: "urgent",    // red
    icon: "💉",
    daysUntil: 3,
  },
  {
    name: "HS Vaccine Reminder",
    detail: "Haemorrhagic Septicaemia — before monsoon season",
    urgency: "warning",   // orange
    icon: "🩺",
    daysUntil: 15,
  },
  {
    name: "BQ Vaccine Due",
    detail: "Black Quarter — for young cattle 6 months–2 years",
    urgency: "warning",
    icon: "⚕️",
    daysUntil: 20,
  },
  {
    name: "Deworming Due",
    detail: "Regular deworming every 3 months for all livestock",
    urgency: "info",      // green
    icon: "💊",
    daysUntil: 30,
  },
];

const URGENCY_STYLE = {
  urgent:  { bg: "#FFEBEE", border: "#EF9A9A", color: "#C62828", badge: "Due Now" },
  warning: { bg: "#FFF3E0", border: "#FFCC80", color: "#E65100", badge: "Upcoming" },
  info:    { bg: "#E8F5E9", border: "#A5D6A7", color: "#2D6A4F", badge: "Scheduled" },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [milkToday, setMilkToday]   = useState(0);
  const [totalAnimals, setTotalAnimals] = useState(0);
  const [farmerName, setFarmerName] = useState("Farmer");

  useEffect(() => {
    // Load farmer name from Firebase or localStorage
    const savedName = localStorage.getItem("farmerName") || "Farmer";
    setFarmerName(savedName);

    // Load total animals from localStorage (set in FarmerProfile)
    const animals = localStorage.getItem("totalAnimals") || "0";
    setTotalAnimals(animals);

    // Load today's milk
    getWeeklyMilk().then(data => {
      if (data.success && data.weekly?.length > 0) {
        const today = data.weekly[data.weekly.length - 1];
        setMilkToday(today?.liters || 0);
      }
    }).catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Namaste 🌅" : hour < 17 ? "Good Afternoon ☀️" : "Good Evening 🌙";

  return (
    <div className="dash-container">
      {/* Header */}
      <div className="dash-header">
        <div>
          <p className="dash-greeting">{greeting}</p>
          <h1 className="dash-name">{farmerName}</h1>
        </div>
        <div className="avatar-circle" onClick={() => navigate("/profile")}>
          {farmerName[0]?.toUpperCase() || "F"}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => navigate("/scan")}>
          <span className="stat-icon">〜</span>
          <p className="stat-val">{totalAnimals || "—"}</p>
          <p className="stat-label">Total Livestock</p>
        </div>
        <div className="stat-card" onClick={() => navigate("/milk")}>
          <span className="stat-icon" style={{ color: "#1565C0" }}>◈</span>
          <p className="stat-val">{milkToday > 0 ? `${milkToday}L` : "—"}</p>
          <p className="stat-label">Today's Milk</p>
        </div>
      </div>

      {/* Quick Actions */}
      <p className="section-title">Quick Actions</p>
      <div className="quick-grid">
        <QuickAction icon="🐄" label="Breed\nEncyclopedia" color="#E8F5E9" tc="#2D6A4F" onClick={() => navigate("/breeds")} />
        <QuickAction icon="💉" label="Vaccine\nGuide" color="#FFEBEE" tc="#C62828" onClick={() => navigate("/vaccines")} />
        <QuickAction icon="🔍" label="Scan\nAnimal" color="#E3F2FD" tc="#1565C0" onClick={() => navigate("/scan")} />
        <QuickAction icon="❤️" label="Health\nCheck" color="#FCE4EC" tc="#880E4F" onClick={() => navigate("/health")} />
      </div>

      {/* Vaccine Alerts */}
      <p className="section-title">
        💉 Vaccine Alerts
        <span className="see-all" onClick={() => navigate("/vaccines")}>See all →</span>
      </p>

      {VACCINE_ALERTS.map((alert, i) => {
        const style = URGENCY_STYLE[alert.urgency];
        return (
          <div
            key={i}
            className="alert-card"
            style={{ background: style.bg, borderLeftColor: style.border }}
            onClick={() => navigate("/vaccines")}
          >
            <span style={{ fontSize: "20px" }}>{alert.icon}</span>
            <div style={{ flex: 1 }}>
              <p className="alert-name">{alert.name}</p>
              <p className="alert-detail">{alert.detail}</p>
              <p className="alert-days" style={{ color: style.color }}>
                {alert.daysUntil <= 3 ? "🔴 Due in " : alert.daysUntil <= 15 ? "🟡 Due in " : "🟢 Due in "}
                {alert.daysUntil} days
              </p>
            </div>
            <span className="urgency-badge" style={{ background: "#fff", color: style.color }}>
              {style.badge}
            </span>
          </div>
        );
      })}

      {/* Today's tip */}
      <p className="section-title">💡 Today's Tip</p>
      <div className="tip-banner">
        <p className="tip-text">
          It's hot outside. Ensure your animals have shaded standing areas and plenty of drinking water to maintain milk yield and prevent heat stress.
        </p>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, color, tc, onClick }) {
  return (
    <div className="quick-card" style={{ background: color }} onClick={onClick}>
      <span style={{ fontSize: "24px" }}>{icon}</span>
      <p className="quick-label" style={{ color: tc }}>{label}</p>
    </div>
  );
}