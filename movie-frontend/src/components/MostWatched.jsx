import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { getMostWatched } from "../services/movieService";
import MovieCard from "./MovieCard";

function MostWatched() {
  const { theme } = useTheme();
  const [movies, setMovies]   = useState([]);
  const [days, setDays]       = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMostWatched = async () => {
      setLoading(true);
      const data = await getMostWatched(days);
      setMovies(data);
      setLoading(false);
    };
    fetchMostWatched();
  }, [days]);

  if (!loading && movies.length === 0) return null;

  return (
    <div style={{ background: theme.bg, padding: "40px 24px 0" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: theme.textMain, margin: "0 0 4px" }}>
               Most Watched
            </h2>
            <p style={{ color: theme.textSub, fontSize: "14px", margin: 0 }}>
              Top movies in the last {days} days
            </p>
          </div>

          {/* Days filter */}
          <div style={{ display: "flex", gap: "8px" }}>
            {[7, 15, 30].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "1px solid " + (days === d ? "#dc2626" : theme.border),
                  background: days === d ? "#dc2626" : theme.bgCard,
                  color: days === d ? "white" : theme.textSub,
                  transition: "all 0.2s",
                }}
              >
                {d} Days
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <p style={{ color: theme.textSub, paddingBottom: "24px" }}>Loading...</p>
        ) : (
          <div style={{
            display: "flex",
            flexDirection: "row",
            gap: "16px",
            overflowX: "auto",
            paddingBottom: "24px",
            scrollbarWidth: "thin",
            scrollbarColor: "#374151 transparent",
          }}>
            {movies.map((movie, index) => (
              <div key={movie._id} style={{ position: "relative", flexShrink: 0 }}>
                {/* Rank badge */}
                <div style={{
                  position: "absolute",
                  top: "-8px",
                  left: "-8px",
                  background: index === 0 ? "#eab308" : index === 1 ? "#9ca3af" : index === 2 ? "#b45309" : "#374151",
                  color: "white",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: "13px",
                  zIndex: 20,
                  border: "2px solid " + theme.bg,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}>
                  {index + 1}
                </div>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default MostWatched;