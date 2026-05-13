import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getMoviesByMood } from "../services/movieService";
import MovieCard from "./MovieCard";

const moods = [
  { id: "happy",      emoji: "😊", label: "Happy",      color: "#f59e0b", bg: "#fef3c7" },
  { id: "sad",        emoji: "😢", label: "Sad",        color: "#3b82f6", bg: "#dbeafe" },
  { id: "excited",    emoji: "🤩", label: "Excited",    color: "#ef4444", bg: "#fee2e2" },
  { id: "romantic",   emoji: "💕", label: "Romantic",   color: "#ec4899", bg: "#fce7f3" },
  { id: "scared",     emoji: "😱", label: "Scared",     color: "#8b5cf6", bg: "#ede9fe" },
  { id: "thoughtful", emoji: "🤔", label: "Thoughtful", color: "#10b981", bg: "#d1fae5" },
];

function MoodPicker() {
  const { theme, isDark } = useTheme();
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodMovies, setMoodMovies] = useState([]);

  // ✅ useEffect properly imported and used
  useEffect(() => {
    if (selectedMood) {
      const fetchMoodMovies = async () => {
        const movies = await getMoviesByMood(selectedMood);
        setMoodMovies(movies);
      };
      fetchMoodMovies();
    } else {
      setMoodMovies([]);
    }
  }, [selectedMood]);

  const currentMood = moods.find((m) => m.id === selectedMood);

  return (
    <div style={{
      background: theme.bg,
      padding: "48px 24px",
      borderTop: "1px solid " + theme.border,
      borderBottom: "1px solid " + theme.border,
    }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 800, color: theme.textMain, margin: "0 0 8px" }}>
            🎭 What's Your Mood?
          </h2>
          <p style={{ color: theme.textSub, fontSize: "15px", margin: 0 }}>
            Pick how you're feeling and we'll recommend the perfect movie
          </p>
        </div>

        {/* Mood Buttons */}
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "12px", marginBottom: "40px" }}>
          {moods.map((mood) => {
            const isSelected = selectedMood === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(isSelected ? null : mood.id)}
                style={{
                  display: "flex", flexDirection: "column",
                  alignItems: "center", gap: "8px",
                  padding: "16px 24px", borderRadius: "16px",
                  border: "2px solid " + (isSelected ? mood.color : theme.border),
                  background: isSelected ? (isDark ? mood.color + "22" : mood.bg) : theme.bgCard,
                  cursor: "pointer", transition: "all 0.2s ease",
                  transform: isSelected ? "scale(1.08)" : "scale(1)",
                  boxShadow: isSelected ? "0 8px 24px " + mood.color + "44" : "none",
                  minWidth: "100px",
                }}
              >
                <span style={{ fontSize: "36px", lineHeight: 1 }}>{mood.emoji}</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: isSelected ? mood.color : theme.textSub }}>
                  {mood.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Movie Results */}
        {selectedMood && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: 700, color: theme.textMain, margin: "0 0 4px" }}>
                {currentMood.emoji} Movies for when you're feeling {currentMood.label}
              </h3>
              <p style={{ color: theme.textSub, fontSize: "14px", margin: 0 }}>
                {moodMovies.length} movies found
              </p>
            </div>

            {moodMovies.length === 0 ? (
              <p style={{ textAlign: "center", color: theme.textSub, fontSize: "16px" }}>
                No movies found for this mood 😕
              </p>
            ) : (
              <div style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                overflowX: "auto",
                overflowY: "visible",
                paddingBottom: "16px",
                paddingTop: "8px",
                scrollbarWidth: "thin",
                scrollbarColor: "#374151 transparent",
              }}>
                {moodMovies.map((movie) => (
                  // ✅ Use _id for MongoDB
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default MoodPicker;