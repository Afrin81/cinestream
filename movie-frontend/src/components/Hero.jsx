import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const featuredMovies = [
  {
    id: 1,
    title: "Avengers",
    genre: "Action",
    rating: 4.8,
    year: 2012,
    duration: "2h 23m",
    isPremium: false,
    description: "Earth's mightiest heroes must come together and learn to fight as a team to stop the mischievous Loki and his alien army from enslaving humanity.",
    banner: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1920",
  },
  {
    id: 4,
    title: "Interstellar",
    genre: "Sci-Fi",
    rating: 4.9,
    year: 2014,
    duration: "2h 49m",
    isPremium: true,
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival as Earth faces an environmental collapse.",
    banner: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920",
  },
  {
    id: 7,
    title: "Inception",
    genre: "Sci-Fi",
    rating: 4.9,
    year: 2010,
    duration: "2h 28m",
    isPremium: true,
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    banner: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1920",
  },
  {
    id: 3,
    title: "Spider-Man",
    genre: "Action",
    rating: 4.7,
    year: 2021,
    duration: "2h 28m",
    isPremium: false,
    description: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.",
    banner: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1920",
  },
];

function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🎨 Get theme
  const { isDark } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === featuredMovies.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const movie = featuredMovies[currentIndex];

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>

      {/* ── Background Slides ── */}
      {featuredMovies.map((m, index) => (
        <div
          key={m.id}
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

            {/* Buttons */}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <button style={{ background: "#dc2626", color: "white", padding: "14px 32px", borderRadius: "12px", fontWeight: 700, fontSize: "16px", border: "none", cursor: "pointer" }}>
                 Watch Now
              </button>
              <button style={{ background: "rgba(255,255,255,0.15)", color: "white", padding: "14px 24px", borderRadius: "12px", fontWeight: 700, fontSize: "16px", border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer" }}>
                + Watchlist
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── Dot Indicators ── */}
      <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "8px", zIndex: 10 }}>
        {featuredMovies.map((_, index) => (
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
        onClick={() => setCurrentIndex((prev) => prev === 0 ? featuredMovies.length - 1 : prev - 1)}
        style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", zIndex: 10, background: "rgba(0,0,0,0.5)", color: "white", width: "44px", height: "44px", borderRadius: "50%", border: "none", cursor: "pointer", fontSize: "22px" }}
      >
        ‹
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => setCurrentIndex((prev) => prev === featuredMovies.length - 1 ? 0 : prev + 1)}
        style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", zIndex: 10, background: "rgba(0,0,0,0.5)", color: "white", width: "44px", height: "44px", borderRadius: "50%", border: "none", cursor: "pointer", fontSize: "22px" }}
      >
        ›
      </button>

    </div>
  );
}

export default Hero;