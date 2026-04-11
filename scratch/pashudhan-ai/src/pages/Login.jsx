// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode]         = useState("login"); // "login" | "signup"
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit() {
    if (!email || !password) { setError("Please fill all fields."); return; }
    if (mode === "signup" && !name) { setError("Please enter your name."); return; }
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        localStorage.setItem("farmerName", name);
      }
      navigate("/dashboard");
    } catch (e) {
      const msg = e.code === "auth/user-not-found"     ? "No account found with this email." :
                  e.code === "auth/wrong-password"      ? "Incorrect password." :
                  e.code === "auth/email-already-in-use"? "Email already registered. Please login." :
                  e.code === "auth/weak-password"       ? "Password must be at least 6 characters." :
                  e.code === "auth/invalid-email"       ? "Invalid email address." :
                  "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }


  function handleKeyDown(e) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div className="login-bg">

      {/* Decorative blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="login-card">

        {/* ── Logo / Brand ── */}
        <div className="login-brand">
          <div className="brand-icon">🐄</div>
          <div>
            <h1 className="brand-name">Pashudhan AI</h1>
            <p className="brand-tagline">Smart Livestock Management</p>
          </div>
        </div>

        {/* ── Mode Toggle ── */}
        <div className="mode-toggle">
          <button
            className={`mode-btn ${mode === "login" ? "active" : ""}`}
            onClick={() => { setMode("login"); setError(""); }}
          >
            Login
          </button>
          <button
            className={`mode-btn ${mode === "signup" ? "active" : ""}`}
            onClick={() => { setMode("signup"); setError(""); }}
          >
            Sign Up
          </button>
        </div>

        {/* ── Welcome text ── */}
        <div className="login-welcome">
          <h2 className="welcome-title">
            {mode === "login" ? "Welcome back 👋" : "Create account 🌱"}
          </h2>
          <p className="welcome-sub">
            {mode === "login"
              ? "Login to manage your livestock"
              : "Join thousands of smart farmers"}
          </p>
        </div>

        {/* ── Form ── */}
        <div className="login-form">

          {mode === "signup" && (
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="login-input"
              />
            </div>
          )}

          <div className="input-group">
            <span className="input-icon">📧</span>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className="login-input"
            />
          </div>

          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="login-input"
            />
            <button
              className="pass-toggle"
              onClick={() => setShowPass(p => !p)}
              tabIndex={-1}
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>

          {mode === "login" && (
            <p className="forgot-link">Forgot password?</p>
          )}

          {/* Error */}
          {error && (
            <div className="login-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Submit */}
          <button
            className="login-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="btn-spinner-wrap">
                <span className="btn-spinner" />
                {mode === "login" ? "Logging in..." : "Creating account..."}
              </span>
            ) : (
              mode === "login" ? "Login →" : "Create Account →"
            )}
          </button>

        </div>

        {/* ── Footer ── */}
        <p className="login-footer">
          {mode === "login" ? "New to Pashudhan AI? " : "Already have an account? "}
          <span
            className="footer-link"
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
          >
            {mode === "login" ? "Sign up free" : "Login"}
          </span>
        </p>

      </div>
    </div>
  );
}