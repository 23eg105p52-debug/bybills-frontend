import React, { useState } from "react";
import { toast } from "react-toastify";
import "../App.css"; // make sure CSS is imported

function Signup({ goToLogin }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    // 🚫 Empty fields check
    if (!name || !password) {
      toast.warning("Please fill all fields ⚠️");
      return;
    }

    // 📦 Get users from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // 🔍 Check if user exists
    const exists = users.find((u) => u.name === name);
    if (exists) {
      toast.error("User already exists ❌");
      return;
    }

    // ✅ Add new user
    users.push({ name, password });
    localStorage.setItem("users", JSON.stringify(users));

    toast.success("Signup successful 🎉");

    // 🔄 Clear fields
    setName("");
    setPassword("");

    // ⏩ Go to login page after 1.5 sec
    setTimeout(() => {
      goToLogin();
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>BYBills</h1>
        <p>Create your account to continue</p>

        {/* Username */}
        <input
          type="text"
          placeholder="Enter username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSignup()}
        />

        {/* Button */}
        <button onClick={handleSignup}>
          Create Account →
        </button>

        {/* Switch */}
        <p className="switch">
          Already have an account?{" "}
          <span onClick={goToLogin}>Login</span>
        </p>

      </div>
    </div>
  );
}

export default Signup;