import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useSearchParams } from "react-router-dom";
import { getAllMovies } from "../services/movieService";
import MovieCard from "../components/MovieCard";

const genres = ["All", "Action", "Comedy", "Sci-Fi", "Drama", "Horror", "Romance", "Thriller"];

function Movies() {
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const [allMovies, setAllMovies]           = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedGenre, setSelectedGenre]   = useState("All");
  const [search, setSearch]                 = useState("");
  const [loading, setLoading]               = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const movies = await getAllMovies();
      setAllMovies(movies);
      setFilteredMovies(movies);
      setLoading(false);
    };
    fetchMovies();
  }, []);

  // ✅ Read genre from URL when page loads
  useEffect(() => {
    const genreFromUrl = searchParams.get("genre");
    if (genreFromUrl) {
      setSelectedGenre(genreFromUrl);
    }
  }, [searchParams]);

  // ── Filter movies ──
  useEffect(() => {
    let filtered = allMovies;
    if (selectedGenre !== "All") {
      filtered = filtered.filter((m) => m.genre === selectedGenre);
    }
    if (search) {
      filtered = filtered.filter((m) =>
        m.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredMovies(filtered);
  }, [selectedGenre, search, allMovies]);

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", paddingTop: "90px", paddingBottom: "60px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: 900, color: theme.textMain, margin: "0 0 8px" }}>
            🎬 All Movies
          </h1>
          <p style={{ color: theme.textSub, fontSize: "15px", margin: 0 }}>
            Browse our full collection of movies
          </p>
        </div>

        {/* Search + Filter */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>

          {/* Genre Filter */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                style={{
                  padding: "8px 18px",
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

          {/* Search */}
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

        {/* Movie count */}
        <p style={{ color: theme.textSub, fontSize: "14px", marginBottom: "24px" }}>
          Showing {filteredMovies.length} movies
          {selectedGenre !== "All" && (
            <span style={{ color: "#dc2626", fontWeight: 700 }}> in {selectedGenre}</span>
          )}
        </p>

        {/* Loading */}
        {loading ? (
          <div style={{ textAlign: "center", paddingTop: "80px" }}>
            <p style={{ color: theme.textSub, fontSize: "18px" }}>🎬 Loading movies...</p>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: "80px" }}>
            <p style={{ fontSize: "48px" }}>😕</p>
            <p style={{ color: theme.textSub, fontSize: "18px" }}>No movies found</p>
            <button
              onClick={() => setSelectedGenre("All")}
              style={{ background: "#dc2626", color: "white", border: "none", padding: "10px 24px", borderRadius: "10px", fontWeight: 700, cursor: "pointer", marginTop: "16px" }}
            >
              Show All Movies
            </button>
          </div>
        ) : (
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
          }}>
            {filteredMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Movies;