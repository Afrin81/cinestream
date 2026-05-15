import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useWatchlist } from "../context/WatchlistContext";
import { getAllMovies } from "../services/movieService";

function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [movies, setMovies]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { addToWatchlist, isInWatchlist } = useWatchlist();
  const navigate = useNavigate();

  // ✅ Fetch real movies from backend
  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getAllMovies();
      // Show first 4 movies in hero
      setMovies(data.slice(0, 4));
      setLoading(false);
    };
    fetchMovies();
  }, []);

  // ✅ Auto slide
  useEffect(() => {
    if (movies.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === movies.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [movies]);

  if (loading || movies.length === 0) {
    return (
      <div style={{ width: "100%", height: "100vh", background: "#0f1117", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "white", fontSize: "20px" }}>🎬 Loading...</p>
      </div>
    );
  }

  const movie = movies[currentIndex];
  const inWatchlist = isInWatchlist(movie?._id);

  // ✅ Handle Watch Now
  const handleWatch = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/movie/" + movie._id + "?tab=watch");
  };

  // ✅ Handle Watchlist
  const handleWatchlist = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (inWatchlist) return;
    addToWatchlist(movie);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>

      {/* ── Background Slides ── */}
      {movies.map((m, index) => (
        <div
          key={m._id}
          style={{
            position: "absolute",
            inset: 0,
            opacity: index === currentIndex ? 1 : 0,
            transition: "opacity 1s ease",
            backgroundImage: `
              linear-gradient(to right, ${isDark ? "rgba(0,0,0,0.95)" : "rgba(0,0,0,0.75)"} 30%, rgba(0,0,0,0.3) 90%),
              linear-gradient(to bottom, transparent 60%, ${isDark ? "rgb(15,17,23)" : "rgb(243,244,246)"} 100%),
              url('${m.banner}')
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      {/* ── Content ── */}
      <div style={{
        position: "relative",
        zIndex: 10,
        height: "100%",
        display: "flex",
        alignItems: "center",
        paddingTop: "70px",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", width: "100%" }}>
          <div style={{ maxWidth: "600px" }}>

            {/* Tags */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
              <span style={{ background: "#dc2626", color: "white", fontSize: "12px", padding: "4px 12px", borderRadius: "999px", fontWeight: 600 }}>
                {movie.genre}
              </span>
              {movie.isPremium && (
                <span style={{ background: "#eab308", color: "black", fontSize: "12px", padding: "4px 12px", borderRadius: "999px", fontWeight: 700 }}>
                  💎 Premium
                </span>
              )}
              <span style={{ color: "#d1d5db", fontSize: "14px" }}>{movie.year}</span>
              <span style={{ color: "#d1d5db", fontSize: "14px" }}>{movie.duration}</span>
            </div>

            {/* Title */}
            <h1 style={{ fontSize: "clamp(36px, 7vw, 76px)", fontWeight: 900, color: "white", marginBottom: "16px", lineHeight: 1.1 }}>
              {movie.title}
            </h1>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <span style={{ color: "#facc15" }}>⭐</span>
              <span style={{ color: "white", fontWeight: 700 }}>{movie.rating}</span>
              <span style={{ color: "#9ca3af", fontSize: "14px" }}>/ 5.0</span>
            </div>

            {/* Description */}
            <p style={{ color: "#d1d5db", fontSize: "16px", lineHeight: 1.7, marginBottom: "32px" }}>
              {movie.description}
            </p>

            {/* ✅ Buttons — now connected */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <button
                onClick={handleWatch}
                style={{ background: "#dc2626", color: "white", padding: "14px 32px", borderRadius: "12px", fontWeight: 700, fontSize: "16px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
              >
                ▶ {!user ? "Login to Watch" : "Watch Now"}
              </button>
              <button
                onClick={handleWatchlist}
                style={{
                  background: inWatchlist ? "rgba(220,38,38,0.3)" : "rgba(255,255,255,0.15)",
                  color: "white",
                  padding: "14px 24px",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "16px",
                  border: inWatchlist ? "1px solid #dc2626" : "1px solid rgba(255,255,255,0.3)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {inWatchlist ? "✓ Saved" : "+ Watchlist"}
              </button>

              {/* ✅ More Info button */}
              <button
                onClick={() => navigate("/movie/" + movie._id)}
                style={{ background: "rgba(255,255,255,0.1)", color: "white", padding: "14px 24px", borderRadius: "12px", fontWeight: 600, fontSize: "16px", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}
              >
                ℹ️ More Info
              </button>
            </div>

            {/* Login hint */}
            {!user && (
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "12px" }}>
                🔒 Please{" "}
                <span onClick={() => navigate("/login")} style={{ color: "#dc2626", cursor: "pointer", fontWeight: 700, textDecoration: "underline" }}>
                  login
                </span>
                {" "}to watch movies
              </p>
            )}

          </div>
        </div>
      </div>

      {/* ── Dot Indicators ── */}
      <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px", zIndex: 10 }}>
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            style={{
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s",
              background: index === currentIndex ? "#ef4444" : "#6b7280",
              width: index === currentIndex ? "32px" : "8px",
              height: "8px",
            }}
          />
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={() => setCurrentIndex((prev) => prev === 0 ? movies.length - 1 : prev - 1)}
        style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", zIndex: 10, background: "rgba(0,0,0,0.5)", color: "white", width: "44px", height: "44px", borderRadius: "50%", border: "none", cursor: "pointer", fontSize: "22px" }}
      >
        ‹
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => setCurrentIndex((prev) => prev === movies.length - 1 ? 0 : prev + 1)}
        style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", zIndex: 10, background: "rgba(0,0,0,0.5)", color: "white", width: "44px", height: "44px", borderRadius: "50%", border: "none", cursor: "pointer", fontSize: "22px" }}
      >
        ›
      </button>

    </div>
  );
}

export default Hero;