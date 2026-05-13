import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/authService";

function Register() {
  const { theme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName]                     = useState("");
  const [email, setEmail]                   = useState("");
  const [password, setPassword]             = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError]                   = useState("");
  const [loading, setLoading]               = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Passwords match check
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    // ✅ Password length check
    if (password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    setLoading(true);

    try {
      // ✅ await the async registerUser
      const result = await registerUser({ name, email, password });

      if (result.success) {
        // ✅ Auto login after register with real user data from backend
        login(result.user);
        // ✅ Go to home page
        navigate("/");
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: theme.bg,
      padding: "24px",
      paddingTop: "90px",
    }}>
      <div style={{
        background: theme.bgCard,
        borderRadius: "20px",
        padding: "40px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        border: "1px solid " + theme.border,
      }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ color: "#dc2626", fontWeight: 900, fontSize: "26px", margin: "0 0 8px" }}>
            🎬 CineStream
          </h1>
          <p style={{ color: theme.textSub, fontSize: "14px", margin: 0 }}>
            Create your free account today!
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", color: "#dc2626", padding: "12px 16px", borderRadius: "10px", fontSize: "14px", marginBottom: "20px" }}>
            ❌ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Name */}
          <div>
            <label style={{ color: theme.textSub, fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: "100%", background: theme.bgInput, border: "1px solid " + theme.border, color: theme.textMain, padding: "12px 16px", borderRadius: "10px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {/* Email */}
          <div>
            <label style={{ color: theme.textSub, fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", background: theme.bgInput, border: "1px solid " + theme.border, color: theme.textMain, padding: "12px 16px", borderRadius: "10px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ color: theme.textSub, fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", background: theme.bgInput, border: "1px solid " + theme.border, color: theme.textMain, padding: "12px 16px", borderRadius: "10px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{ color: theme.textSub, fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ width: "100%", background: theme.bgInput, border: "1px solid " + theme.border, color: theme.textMain, padding: "12px 16px", borderRadius: "10px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{ background: loading ? "#9ca3af" : "#dc2626", color: "white", border: "none", padding: "14px", borderRadius: "10px", fontWeight: 700, fontSize: "16px", cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s" }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
          <div style={{ flex: 1, height: "1px", background: theme.border }} />
          <span style={{ color: theme.textSub, fontSize: "13px" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: theme.border }} />
        </div>

        {/* Login link */}
        <p style={{ textAlign: "center", color: theme.textSub, fontSize: "14px", margin: 0 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#dc2626", fontWeight: 700, textDecoration: "none" }}>
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;