// src/pages/MilkPage.jsx
import { useState, useEffect } from "react";
import { addMilkEntry, getWeeklyMilk } from "../services/api";
import "./MilkPage.css";

export default function MilkPage() {
  const [liters, setLiters]         = useState("");
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyAvg, setMonthlyAvg] = useState(0);
  const [loading, setLoading]       = useState(false);
  const [adding, setAdding]         = useState(false);
  const [message, setMessage]       = useState("");

  async function fetchData() {
    setLoading(true);
    try {
      const data = await getWeeklyMilk();
      if (data.success) {
        setWeeklyData(data.weekly);
        setMonthlyAvg(data.monthly_average);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  async function handleAdd() {
    const val = parseFloat(liters);
    if (!liters || isNaN(val) || val <= 0) {
      setMessage("Please enter a valid number of liters.");
      return;
    }
    setAdding(true);
    setMessage("");
    try {
      const res = await addMilkEntry(val);
      if (res.success) {
        setLiters("");
        setMessage(`✅ Saved ${val}L for today!`);
        await fetchData();
      } else {
        setMessage("Error: " + (res.error || "Could not save"));
      }
    } catch (e) {
      setMessage("Network error: " + e.message);
    } finally {
      setAdding(false);
    }
  }

  const maxVal = Math.max(...weeklyData.map((d) => d.liters), 1);
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="page-container">
      <p className="page-label">Production</p>
      <h1 className="page-title">Milk Tracking</h1>

      {/* Add Entry */}
      <div className="card">
        <div className="add-row">
          <input
            className="liters-input"
            type="number"
            min="0"
            step="0.1"
            placeholder="Enter liters..."
            value={liters}
            onChange={(e) => setLiters(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button
            className="add-btn"
            onClick={handleAdd}
            disabled={adding}
          >
            {adding ? <span className="spinner" /> : "+ Add"}
          </button>
        </div>
        {message && (
          <p className={message.startsWith("✅") ? "msg-success" : "msg-error"}>
            {message}
          </p>
        )}
      </div>

      {/* Bar Chart */}
      <div className="card">
        <h2 className="card-title">Weekly Yield (Total)</h2>
        {loading ? (
          <div className="loading-wrap">
            <span className="spinner dark" /> Loading...
          </div>
        ) : (
          <div className="chart-area">
            {weeklyData.map((d) => {
              const isToday = d.date === todayStr;
              const heightPct = d.liters > 0 ? (d.liters / maxVal) * 100 : 2;
              return (
                <div key={d.date} className="bar-col">
                  {d.liters > 0 && (
                    <span className="bar-label">{d.liters}L</span>
                  )}
                  <div
                    className={`bar ${isToday ? "bar-today" : "bar-normal"}`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className={`day-label ${isToday ? "day-today" : ""}`}>
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Monthly Average */}
      <div className="avg-card">
        <div className="avg-left">
          <span className="avg-icon">📊</span>
          <span className="avg-label">Monthly Average</span>
        </div>
        <span className="avg-value">{monthlyAvg} L / day</span>
      </div>
    </div>
  );
}