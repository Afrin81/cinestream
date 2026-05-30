import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllMovies } from "../services/movieService";
import { useTheme } from "../context/ThemeContext";
import MovieCard from "../components/MovieCard";

const genres = ["All", "Action", "Comedy", "Sci-Fi", "Drama", "Horror"];

function Home() {
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const navigate = useNavigate();

  // 🎬 Fetch movies from backend
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const movies = await getAllMovies();
      setAllMovies(movies);
      setLoading(false);
    };
    fetchMovies();
  }, []);

  const filteredMovies = allMovies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(search.toLowerCase());
    const matchesGenre  = selectedGenre === "All" || movie.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", color: theme.textMain }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>

        {/* ── Section Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
          <div>
            <h2 style={{ fontSize: "28px", fontWeight: 800, margin: 0, color: theme.textMain }}>
               Trending Now
            </h2>
            <p style={{ color: theme.textSub, fontSize: "14px", margin: "4px 0 0" }}>
              Most watched movies this week
            </p>
          </div>
          <input
            type="text"
            placeholder=" Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: theme.bgInput,
              border: "1px solid " + theme.border,
              color: theme.textMain,
              padding: "10px 16px",
              borderRadius: "12px",
              fontSize: "14px",
              outline: "none",
              width: "240px",
            }}
          />
        </div>

        {/* ── Genre Filter ── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "32px" }}>
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              style={{
                padding: "6px 16px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                border: "1px solid " + (selectedGenre === genre ? "#dc2626" : theme.border),
                background: selectedGenre === genre ? "#dc2626" : theme.bgCard,
                color: selectedGenre === genre ? "white" : theme.textSub,
                transition: "all 0.2s",
              }}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* ── Loading State ── */}
        {loading ? (
          <div style={{ textAlign: "center", marginTop: "80px" }}>
            <p style={{ color: theme.textSub, fontSize: "18px" }}>
              🎬 Loading movies...
            </p>
          </div>
        ) : filteredMovies.length === 0 ? (
          <p style={{ color: theme.textSub, textAlign: "center", marginTop: "80px", fontSize: "18px" }}>
            No movies found 😕
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
            {filteredMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}

        {/* ── View All Button ── */}
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <button
            onClick={() => navigate("/movies")}
            style={{
              border: "1px solid " + theme.border,
              background: "transparent",
              color: theme.textSub,
              padding: "12px 32px",
              borderRadius: "12px",
              fontWeight: 600,
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            View All Movies →
          </button>
        </div>

      </div>
    </div>
  );
}

export default Home;