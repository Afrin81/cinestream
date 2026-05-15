import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useWatchlist } from "../context/WatchlistContext";
import { FaTrash, FaPlay, FaFilm } from "react-icons/fa";

function Watchlist() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const navigate = useNavigate();

  // 🔒 Not logged in
  if (!user) {
    return (
      <div style={{
        minHeight: "100vh", background: theme.bg,
        display: "flex", alignItems: "center",
        justifyContent: "center", flexDirection: "column",
        gap: "16px", paddingTop: "70px",
      }}>
        <p style={{ fontSize: "48px" }}>🔒</p>
        <h2 style={{ color: theme.textMain, fontSize: "24px", fontWeight: 800, margin: 0 }}>
          Login to see your Watchlist
        </h2>
        <p style={{ color: theme.textSub, fontSize: "15px", margin: 0 }}>
          Save movies to watch later
        </p>
        <button
          onClick={() => navigate("/login")}
          style={{ background: "#dc2626", color: "white", border: "none", padding: "12px 32px", borderRadius: "12px", fontWeight: 700, fontSize: "16px", cursor: "pointer", marginTop: "8px" }}
        >
          Login Now
        </button>
      </div>
    );
  }

  // 📋 Empty watchlist
  if (watchlist.length === 0) {
    return (
      <div style={{
        minHeight: "100vh", background: theme.bg,
        display: "flex", alignItems: "center",
        justifyContent: "center", flexDirection: "column",
        gap: "16px", paddingTop: "70px",
      }}>
        <p style={{ fontSize: "48px" }}>🎬</p>
        <h2 style={{ color: theme.textMain, fontSize: "24px", fontWeight: 800, margin: 0 }}>
          Your Watchlist is Empty
        </h2>
        <p style={{ color: theme.textSub, fontSize: "15px", margin: 0 }}>
          Add movies you want to watch later
        </p>
        <button
          onClick={() => navigate("/")}
          style={{ background: "#dc2626", color: "white", border: "none", padding: "12px 32px", borderRadius: "12px", fontWeight: 700, fontSize: "16px", cursor: "pointer", marginTop: "8px" }}
        >
          Browse Movies
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", color: theme.textMain, paddingTop: "90px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px 60px" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: 900, margin: "0 0 8px", color: theme.textMain }}>
            🎬 My Watchlist
          </h1>
          <p style={{ color: theme.textSub, fontSize: "15px", margin: 0 }}>
            {watchlist.length} movie{watchlist.length > 1 ? "s" : ""} saved
          </p>
        </div>

        {/* ── Movie List ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {watchlist.map((movie) => (
            <div
              key={movie._id}
              style={{
                background: theme.bgCard,
                border: "1px solid " + theme.border,
                borderRadius: "16px",
                overflow: "hidden",
                display: "flex",
                transition: "box-shadow 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
            >
              {/* Poster */}
              <div
                style={{ width: "120px", minWidth: "120px", cursor: "pointer" }}
                onClick={() => navigate("/movie/" + movie._id)}
              >
                <img
                  src={movie.image}
                  alt={movie.title}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/300x450/1a1a2e/ffffff?text=" + encodeURIComponent(movie.title);
                  }}
                  style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }}
                />
              </div>

              {/* Info */}
              <div style={{
                flex: 1, padding: "20px 24px",
                display: "flex", justifyContent: "space-between",
                alignItems: "center", flexWrap: "wrap", gap: "16px",
              }}>
                <div style={{ flex: 1 }}>

                  {/* Title */}
                  <h3
                    onClick={() => navigate("/movie/" + movie._id)}
                    style={{ color: theme.textMain, fontWeight: 800, fontSize: "18px", margin: "0 0 8px", cursor: "pointer" }}
                  >
                    {movie.title}
                  </h3>

                  {/* Tags */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
                    <span style={{ background: "#dc2626", color: "white", fontSize: "11px", padding: "3px 10px", borderRadius: "999px", fontWeight: 600 }}>
                      {movie.genre}
                    </span>
                    <span style={{ background: theme.bgInput, color: theme.textSub, fontSize: "11px", padding: "3px 10px", borderRadius: "999px" }}>
                      {movie.year}
                    </span>
                    <span style={{ background: theme.bgInput, color: theme.textSub, fontSize: "11px", padding: "3px 10px", borderRadius: "999px" }}>
                      {movie.duration}
                    </span>
                    <span style={{ color: "#facc15", fontSize: "12px", fontWeight: 700 }}>
                      ⭐ {movie.rating}
                    </span>
                    {movie.isPremium && (
                      <span style={{ background: "#eab308", color: "black", fontSize: "11px", padding: "3px 10px", borderRadius: "999px", fontWeight: 700 }}>
                        💎 Premium
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p style={{
                    color: theme.textSub, fontSize: "13px",
                    lineHeight: 1.6, margin: 0,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    maxWidth: "500px",
                  }}>
                    {movie.description}
                  </p>
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "140px" }}>

                  {/* Trailer */}
                  <button
                    onClick={() => navigate("/movie/" + movie._id + "?tab=trailer")}
                    style={{
                      background: theme.bgInput, color: theme.textMain,
                      border: "1px solid " + theme.border,
                      padding: "9px 16px", borderRadius: "10px",
                      fontWeight: 600, fontSize: "13px", cursor: "pointer",
                      display: "flex", alignItems: "center",
                      gap: "6px", justifyContent: "center",
                    }}
                  >
                    <FaFilm /> Trailer
                  </button>

                  {/* Watch Now */}
                  <button
                    onClick={() => navigate("/movie/" + movie._id + "?tab=watch")}
                    style={{
                      background: "#dc2626", color: "white",
                      border: "none", padding: "9px 16px",
                      borderRadius: "10px", fontWeight: 700,
                      fontSize: "13px", cursor: "pointer",
                      display: "flex", alignItems: "center",
                      gap: "6px", justifyContent: "center",
                    }}
                  >
                    <FaPlay /> Watch Now
                  </button>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromWatchlist(movie._id)}
                    style={{
                      background: "transparent", color: "#ef4444",
                      border: "1px solid #ef4444",
                      padding: "9px 16px", borderRadius: "10px",
                      fontWeight: 600, fontSize: "13px", cursor: "pointer",
                      display: "flex", alignItems: "center",
                      gap: "6px", justifyContent: "center",
                      transition: "all 0.2s",
                    }}
                  >
                    <FaTrash /> Remove
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Watchlist;