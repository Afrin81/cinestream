import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

function Footer() {
  const { theme } = useTheme();

  return (
    <footer
      style={{
        background: theme.bgNav,
        borderTop: "1px solid " + theme.border,
        color: theme.textMain,
        marginTop: "48px",
      }}
    >
      {/* Main grid */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "48px 24px 32px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "40px",
        }}
      >
        {/* Column 1: Logo */}
        <div>
          <h2 style={{ color: "#dc2626", fontWeight: 900, fontSize: "22px", margin: "0 0 12px" }}>
            🎬 CineStream
          </h2>
          <p style={{ color: theme.textSub, fontSize: "14px", lineHeight: 1.7, margin: "0 0 20px" }}>
            Your ultimate destination for movies and entertainment. Watch anywhere, anytime.
          </p>

          {/* Social Icons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <a href="#" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "8px", background: "#1877f2", color: "white", textDecoration: "none", fontSize: "16px" }}>
              <FaFacebookF />
            </a>
            <a href="#" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "8px", background: "#1da1f2", color: "white", textDecoration: "none", fontSize: "16px" }}>
              <FaTwitter />
            </a>
            <a href="#" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "8px", background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", color: "white", textDecoration: "none", fontSize: "16px" }}>
              <FaInstagram />
            </a>
            <a href="#" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "8px", background: "#ff0000", color: "white", textDecoration: "none", fontSize: "16px" }}>
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 style={{ color: theme.textMain, fontWeight: 700, fontSize: "16px", margin: "0 0 16px" }}>
            Quick Links
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { label: "Home",      path: "/" },
              { label: "Movies",    path: "/movies" },
              { label: "Watchlist", path: "/watchlist" },
              { label: "Login",     path: "/login" },
              { label: "Sign Up",   path: "/register" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                style={{ textDecoration: "none", color: theme.textSub, fontSize: "14px", transition: "color 0.2s" }}
                onMouseEnter={(e) => e.target.style.color = "#dc2626"}
                onMouseLeave={(e) => e.target.style.color = theme.textSub}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Column 3: Genres */}
        <div>
          <h3 style={{ color: theme.textMain, fontWeight: 700, fontSize: "16px", margin: "0 0 16px" }}>
            Browse Genres
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {["Action", "Comedy", "Sci-Fi", "Drama", "Horror", "Romance"].map((genre) => (
              <span
                key={genre}
                style={{ color: theme.textSub, fontSize: "14px", cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={(e) => e.target.style.color = "#dc2626"}
                onMouseLeave={(e) => e.target.style.color = theme.textSub}
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <h3 style={{ color: theme.textMain, fontWeight: 700, fontSize: "16px", margin: "0 0 16px" }}>
            Stay Updated
          </h3>
          <p style={{ color: theme.textSub, fontSize: "14px", margin: "0 0 16px", lineHeight: 1.6 }}>
            Subscribe to get notified about new movies and offers.
          </p>

          <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            <input
              type="email"
              placeholder="Your email..."
              style={{
                flex: 1,
                background: theme.bgInput,
                border: "1px solid " + theme.border,
                color: theme.textMain,
                padding: "10px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                outline: "none",
                minWidth: 0,
              }}
            />
            <button style={{ background: "#dc2626", color: "white", border: "none", padding: "10px 16px", borderRadius: "8px", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>
              Subscribe
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <p style={{ color: theme.textSub, fontSize: "13px", margin: 0 }}>support@cinestream.com</p>
            <p style={{ color: theme.textSub, fontSize: "13px", margin: 0 }}>+880 1234 567890</p>
            <p style={{ color: theme.textSub, fontSize: "13px", margin: 0 }}>Dhaka, Bangladesh</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid " + theme.border, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", maxWidth: "1280px", margin: "0 auto" }}>
        <p style={{ color: theme.textSub, fontSize: "13px", margin: 0 }}>
          2025 CineStream. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: "20px" }}>
          <span style={{ color: theme.textSub, fontSize: "13px", cursor: "pointer" }}>Privacy Policy</span>
          <span style={{ color: theme.textSub, fontSize: "13px", cursor: "pointer" }}>Terms of Service</span>
          <span style={{ color: theme.textSub, fontSize: "13px", cursor: "pointer" }}>Cookie Policy</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;