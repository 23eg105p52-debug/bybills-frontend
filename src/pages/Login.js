import React, { useState } from "react";

function Login({ onLogin, goToSignup }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const validUser = users.find(
      (u) => u.name === name && u.password === password
    );
    if (validUser) {
      onLogin(name);
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="auth-container">
      {/* Background effects */}
      <div className="login-orb orb1"></div>
      <div className="login-orb orb2"></div>
      <div className="login-orb orb3"></div>
      <div className="login-grid"></div>

      <div className="auth-card">
        <div className="corner-glow"></div>

        <div className="login-badge">
          <span className="badge-dot"></span> Secure Portal
        </div>

        <h1>Welcome back</h1>
        <p className="auth-subtitle">Sign in to continue to your workspace</p>

        <div className="login-field">
          <label>Username</label>
          <div className="input-wrap">
            <input
              type="text"
              placeholder="Enter your username"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
        </div>

        <div className="login-field">
          <label>Password</label>
          <div className="input-wrap">
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>

        <div className="login-row">
          <button
            onClick={() => alert("Forgot password feature coming soon!")}
            style={{ background: "none", border: "none", padding: 0, boxShadow: "none" }}
            className="forgot-link"
          >
            Forgot password?
          </button>
        </div>

        <button className="login-btn" onClick={login}>
          Sign In
        </button>

        <div className="switch">
          New user?{" "}
          <span onClick={goToSignup}>Signup here</span>
        </div>
      </div>
    </div>
  );
}

export default Login;