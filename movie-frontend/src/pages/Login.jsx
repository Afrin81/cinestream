import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";

function Login() {
  const { theme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ await the async loginUser
      const result = await loginUser({ email, password });

      if (result.success) {
        // ✅ Save user to AuthContext
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
            Welcome back! Please login.
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
          <div style={{ flex: 1, height: "1px", background: theme.border }} />
          <span style={{ color: theme.textSub, fontSize: "13px" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: theme.border }} />
        </div>

        {/* Register link */}
        <p style={{ textAlign: "center", color: theme.textSub, fontSize: "14px", margin: 0 }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#dc2626", fontWeight: 700, textDecoration: "none" }}>
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;