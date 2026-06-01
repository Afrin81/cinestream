import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme, theme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
  { name: "Home",      path: "/" },
  { name: "Movies",    path: "/movies" },
  { name: "Watchlist", path: "/watchlist" },
  { name: "Dashboard", path: "/dashboard" },
];

  return (
    <>
      <style>{`
        .nav-link {
          text-decoration: none;
          font-weight: 600;
          font-size: 15px;
          padding: 6px 4px;
          position: relative;
          transition: color 0.2s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: #dc2626;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .nav-link:hover {
          color: #dc2626 !important;
        }
        .logout-btn:hover {
          border-color: #dc2626 !important;
          color: #dc2626 !important;
        }
        .signup-btn:hover {
          background: #b91c1c !important;
          transform: scale(1.05);
        }
        .mobile-link:hover {
          color: #dc2626 !important;
        }
      `}</style>

      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1000,
          transition: "all 0.3s ease",
          background: scrolled ? theme.bgNav : "transparent",
          borderBottom: scrolled ? "1px solid " + theme.border : "none",
          boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.3)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            height: "70px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ textDecoration: "none", fontSize: "22px", fontWeight: 900, color: "#dc2626" }}>
             CineStream
          </Link>

          {/* Desktop Nav Links */}
          <ul style={{ display: "flex", alignItems: "center", gap: "32px", listStyle: "none", margin: 0, padding: 0 }}
            className="hide-on-mobile"
          >
            {navLinks.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="nav-link"
                  style={{ color: theme.textMain }}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Side */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                background: isDark ? "#374151" : "#e5e7eb",
                border: "none",
                borderRadius: "999px",
                width: "52px",
                height: "28px",
                cursor: "pointer",
                position: "relative",
                transition: "background 0.3s ease",
                flexShrink: 0,
              }}
            >
              <div style={{
                position: "absolute",
                top: "3px",
                left: isDark ? "26px" : "3px",
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "white",
                transition: "left 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                color: isDark ? "#1e293b" : "#f59e0b",
              }}>
                {isDark ? <FaMoon /> : <FaSun />}
              </div>
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }} className="hide-on-mobile">
                <span
                  onClick={() => navigate("/dashboard")}
                  style={{ color: theme.textMain, fontWeight: 600, fontSize: "14px", cursor: "pointer" }}
                >
                   {user.name}
                </span>
                {user.isAdmin && (
                  <Link to="/admin" style={{ textDecoration: "none", color: "#facc15", fontWeight: 700, fontSize: "14px" }}>
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="logout-btn"
                  style={{
                    background: "transparent",
                    border: "1px solid " + theme.border,
                    color: theme.textMain,
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }} className="hide-on-mobile">
                <Link
                  to="/login"
                  className="nav-link"
                  style={{ color: theme.textMain }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="signup-btn"
                  style={{
                    textDecoration: "none",
                    background: "#dc2626",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "14px",
                    padding: "8px 20px",
                    borderRadius: "8px",
                    transition: "all 0.2s",
                  }}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Hamburger mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="show-on-mobile"
              style={{
                background: "transparent",
                border: "none",
                color: theme.textMain,
                fontSize: "20px",
                cursor: "pointer",
                display: "none",
              }}
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            background: theme.bgNav,
            borderTop: "1px solid " + theme.border,
            padding: "16px 24px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}>
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className="mobile-link"
                style={{ textDecoration: "none", color: theme.textMain, fontWeight: 600, fontSize: "16px", transition: "color 0.2s" }}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <>
                <span style={{ color: theme.textMain, fontWeight: 600 }}>👋 {user.name}</span>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  style={{ background: "transparent", border: "1px solid " + theme.border, color: theme.textMain, padding: "10px", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: theme.textMain, fontWeight: 600, fontSize: "16px" }}>Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", background: "#dc2626", color: "white", fontWeight: 700, fontSize: "15px", padding: "10px 16px", borderRadius: "8px", textAlign: "center" }}>Sign Up</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;