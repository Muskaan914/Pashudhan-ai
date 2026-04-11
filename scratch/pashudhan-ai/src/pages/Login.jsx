// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
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

  // Handle Google redirect result on page load
  useEffect(() => {
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        const userName = result.user.displayName || "Farmer";
        localStorage.setItem("farmerName", userName);
        navigate("/dashboard");
      }
    }).catch(() => {});
  }, []);

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

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
      // Page will redirect — no need to navigate here
    } catch (e) {
      setError("Google sign-in failed. Please try again.");
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

          {/* Divider */}
          <div className="divider">
            <span className="divider-line" />
            <span className="divider-text">or</span>
            <span className="divider-line" />
          </div>

          {/* Google */}
          <button className="google-btn" onClick={handleGoogle} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
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