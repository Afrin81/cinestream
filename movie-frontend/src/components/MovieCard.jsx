import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useWatchlist } from "../context/WatchlistContext";
import { useAuth } from "../context/AuthContext";

function MovieCard({ movie }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { user } = useAuth();

  const inWatchlist = isInWatchlist(movie._id);

  const handleWatchlist = (e) => {
    e.stopPropagation();
    if (!user) { navigate("/login"); return; }
    if (inWatchlist) {
      removeFromWatchlist(movie._id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: isHovered ? "380px" : "160px",
        minWidth: isHovered ? "380px" : "160px",
        height: "240px",
        borderRadius: "12px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        flexShrink: 0,
        background: theme.bgCard,
        boxShadow: isHovered
          ? "0 20px 50px rgba(0,0,0,0.5)"
          : "0 4px 12px rgba(0,0,0,0.2)",
        transition: "width 0.4s ease, min-width 0.4s ease, box-shadow 0.3s ease",
        cursor: "pointer",
        position: "relative",
        zIndex: isHovered ? 10 : 1,
      }}
      onClick={() => navigate("/movie/" + movie._id)}
    >
      {/* ── Left: Poster or Trailer ── */}
      <div style={{
        width: "160px", minWidth: "160px",
        position: "relative", flexShrink: 0, overflow: "hidden",
      }}>

        {/* 🎬 Show trailer video on hover if trailerPreview exists */}
        {isHovered && movie.trailerPreview ? (
          <video
            src={movie.trailerPreview}
            autoPlay
            muted
            loop
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <img
            src={movie.image}
            alt={movie.title}
            onError={(e) => {
              e.target.src = "https://placehold.co/300x450/1a1a2e/ffffff?text=" + encodeURIComponent(movie.title);
            }}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        )}

        {/* Dark gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)",
        }} />

        {/* Play icon on hover */}
        {isHovered && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{
              width: "44px", height: "44px",
              borderRadius: "50%",
              background: "rgba(220,38,38,0.9)",
              display: "flex", alignItems: "center",
              justifyContent: "center",
              fontSize: "18px", color: "white",
              boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
            }}>
              ▶
            </div>
          </div>
        )}

        {/* Premium badge */}
        {movie.isPremium && (
          <div style={{
            position: "absolute", top: "8px", left: "8px",
            background: "#eab308", color: "black",
            fontSize: "10px", padding: "2px 8px",
            borderRadius: "999px", fontWeight: 700, zIndex: 2,
          }}>
            💎
          </div>
        )}

        {/* Title at bottom when NOT hovered */}
        {!isHovered && (
          <div style={{
            position: "absolute", bottom: 0,
            left: 0, right: 0,
            padding: "20px 10px 8px",
          }}>
            <p style={{
              color: "white", fontSize: "12px", fontWeight: 700,
              margin: "0 0 2px", whiteSpace: "nowrap",
              overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {movie.title}
            </p>
            <p style={{ color: "#facc15", fontSize: "11px", margin: 0, fontWeight: 600 }}>
              ⭐ {movie.rating}
            </p>
          </div>
        )}
      </div>

      {/* ── Right: Info Panel ── */}
      <div style={{
        flex: 1, minWidth: 0,
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        padding: isHovered ? "16px 14px" : "0px",
        opacity: isHovered ? 1 : 0,
        transform: isHovered ? "translateX(0)" : "translateX(-10px)",
        transition: "opacity 0.25s ease 0.2s, transform 0.25s ease 0.2s, padding 0.3s ease",
        overflow: "hidden",
        background: theme.bgCard,
        pointerEvents: isHovered ? "all" : "none",
      }}>
        <div>
          <h3 style={{
            color: theme.textMain, fontWeight: 800,
            fontSize: "14px", margin: "0 0 5px",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {movie.title}
          </h3>
          <p style={{ color: theme.textSub, fontSize: "11px", margin: "0 0 5px" }}>
            {movie.genre} • {movie.year} • {movie.duration}
          </p>
          <p style={{ color: "#facc15", fontSize: "11px", fontWeight: 700, margin: "0 0 8px" }}>
            ⭐ {movie.rating} / 5.0
          </p>
          {movie.isPremium && (
            <p style={{ color: "#eab308", fontSize: "11px", fontWeight: 700, margin: "0 0 6px" }}>
              💎 Premium
            </p>
          )}
          <p style={{
            color: theme.textSub, fontSize: "11px",
            lineHeight: 1.55, margin: 0,
            display: "-webkit-box", WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {movie.description}
          </p>
        </div>

        <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
          <button
            onClick={(e) => { e.stopPropagation(); navigate("/movie/" + movie._id + "?tab=trailer"); }}
            style={{ background: "rgba(255,255,255,0.08)", color: theme.textMain, border: "1px solid " + theme.border, borderRadius: "8px", padding: "6px 10px", fontWeight: 600, fontSize: "11px", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            🎬 Trailer
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate("/movie/" + movie._id + "?tab=watch"); }}
            style={{ background: "#dc2626", color: "white", border: "none", borderRadius: "8px", padding: "6px 12px", fontWeight: 700, fontSize: "11px", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            ▶ Watch
          </button>
          <button
            onClick={handleWatchlist}
            style={{
              background: inWatchlist ? "#dc2626" : "rgba(255,255,255,0.08)",
              color: inWatchlist ? "white" : theme.textMain,
              border: "1px solid " + (inWatchlist ? "#dc2626" : theme.border),
              borderRadius: "8px", padding: "6px 8px",
              fontWeight: 600, fontSize: "11px",
              cursor: "pointer", whiteSpace: "nowrap",
              transition: "all 0.2s",
            }}
          >
            {inWatchlist ? "✓ Saved" : "+ List"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;