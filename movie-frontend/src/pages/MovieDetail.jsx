import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useWatchlist } from "../context/WatchlistContext";
import { getMovieById, getSimilarMovies, saveWatchHistory } from "../services/movieService";
import { FaPlay, FaPlus, FaArrowLeft, FaFilm, FaLock, FaCrown } from "react-icons/fa";
import MovieCard from "../components/MovieCard";

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();
  const { user, isPremium } = useAuth();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const [showTrailer, setShowTrailer]     = useState(false);
  const [showMovie, setShowMovie]         = useState(false);
  const [movie, setMovie]                 = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      const data = await getMovieById(id);
      setMovie(data);
      if (data) {
        const similar = await getSimilarMovies(id);
        setSimilarMovies(similar);
      }
      setLoading(false);
      if (searchParams.get("tab") === "trailer") setShowTrailer(true);
      if (searchParams.get("tab") === "watch")   setShowMovie(true);
    };
    fetchMovie();
  }, [id]);

  const inWatchlist = isInWatchlist(movie?._id);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: theme.textMain, fontSize: "20px" }}>🎬 Loading...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <p style={{ color: theme.textMain, fontSize: "24px" }}>Movie not found 😕</p>
        <button onClick={() => navigate("/")} style={{ background: "#dc2626", color: "white", border: "none", padding: "12px 24px", borderRadius: "10px", fontWeight: 700, cursor: "pointer" }}>
          Go Home
        </button>
      </div>
    );
  }

  const handleWatch = () => {
    if (!user) { navigate("/login"); return; }
    if (movie.isPremium && !isPremium) { navigate("/payment"); return; }

    saveWatchHistory(movie._id);

    const historyKey = `recentlyWatched_${user._id}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || "[]");
    const exists = history.find(m => m._id === movie._id);
    if (!exists) {
      const updated = [movie, ...history].slice(0, 20);
      localStorage.setItem(historyKey, JSON.stringify(updated));
    }

    setShowMovie(true);
    setShowTrailer(false);
  };

  const handleTrailer = () => {
    setShowTrailer(true);
    setShowMovie(false);
  };

  const handleWatchlist = () => {
    if (!user) { navigate("/login"); return; }
    if (inWatchlist) {
      removeFromWatchlist(movie._id);
    } else {
      addToWatchlist(movie);
    }
  };

  const closeModal = () => {
    setShowTrailer(false);
    setShowMovie(false);
  };

  const getEmbedUrl = (url) => {
    if (!url) return "";
    const baseUrl = url.split("?")[0];
    return baseUrl + "?autoplay=1&rel=0&modestbranding=1";
  };

  const getWatchButtonText = () => {
    if (!user) return "Login to Watch";
    if (movie.isPremium && !isPremium) return "Upgrade to Watch";
    return "Watch Now";
  };

  const getWatchButtonBg = () => {
    if (!user) return "rgba(255,255,255,0.15)";
    if (movie.isPremium && !isPremium) return "#eab308";
    return "#dc2626";
  };

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", color: theme.textMain }}>

      {/* ── Banner ── */}
      <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
        <img
          src={movie.banner}
          alt={movie.title}
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1920"; }}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.92) 40%, rgba(0,0,0,0.3) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 40%, " + theme.bg + " 100%)" }} />

        <button
          onClick={() => navigate(-1)}
          style={{ position: "absolute", top: "90px", left: "32px", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", color: "white", border: "1px solid rgba(255,255,255,0.3)", padding: "10px 20px", borderRadius: "10px", fontWeight: 700, cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}
        >
          <FaArrowLeft /> Back
        </button>

        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 40px", paddingTop: "70px", maxWidth: "1280px", margin: "0 auto", left: 0, right: 0 }}>
          <div style={{ display: "flex", gap: "48px", alignItems: "flex-end", flexWrap: "wrap" }}>

            {/* Poster */}
            <div style={{ flexShrink: 0, position: "relative" }}>
              <img
                src={movie.image}
                alt={movie.title}
                onError={(e) => { e.target.src = "https://placehold.co/300x450/1a1a2e/ffffff?text=" + encodeURIComponent(movie.title); }}
                style={{ width: "220px", height: "320px", objectFit: "cover", borderRadius: "16px", boxShadow: "0 30px 80px rgba(0,0,0,0.8)", border: "3px solid rgba(255,255,255,0.2)" }}
              />
              {movie.isPremium && (!user || !isPremium) && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "8px" }}>
                  <FaLock style={{ color: "#eab308", fontSize: "32px" }} />
                  <span style={{ color: "#eab308", fontSize: "12px", fontWeight: 700, background: "rgba(0,0,0,0.5)", padding: "4px 12px", borderRadius: "999px" }}>
                    Premium Only
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ maxWidth: "600px" }}>
              {movie.isPremium && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#eab308", color: "black", fontSize: "12px", padding: "4px 14px", borderRadius: "999px", fontWeight: 700, marginBottom: "12px" }}>
                  <FaCrown /> Premium
                </div>
              )}

              <h1 style={{ fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 900, color: "white", margin: "0 0 16px", lineHeight: 1.1, textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
                {movie.title}
              </h1>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                <span style={{ background: "#dc2626", color: "white", fontSize: "12px", padding: "4px 14px", borderRadius: "999px", fontWeight: 700 }}>{movie.genre}</span>
                <span style={{ background: "rgba(255,255,255,0.15)", color: "white", fontSize: "12px", padding: "4px 14px", borderRadius: "999px" }}>{movie.year}</span>
                <span style={{ background: "rgba(255,255,255,0.15)", color: "white", fontSize: "12px", padding: "4px 14px", borderRadius: "999px" }}>{movie.duration}</span>
                <span style={{ background: "#854d0e", color: "#fef08a", fontSize: "12px", padding: "4px 14px", borderRadius: "999px", fontWeight: 700 }}>⭐ {movie.rating} / 5.0</span>
              </div>

              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", lineHeight: 1.8, marginBottom: "28px", maxWidth: "550px" }}>
                {movie.description}
              </p>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <button
                  onClick={handleWatch}
                  style={{ background: getWatchButtonBg(), color: (movie.isPremium && !isPremium && user) ? "black" : "white", border: !user ? "1px solid rgba(255,255,255,0.3)" : "none", padding: "14px 32px", borderRadius: "12px", fontWeight: 700, fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 8px 24px rgba(0,0,0,0.3)", transition: "all 0.2s" }}
                >
                  {!user ? <FaLock /> : movie.isPremium && !isPremium ? <FaCrown /> : <FaPlay />}
                  {getWatchButtonText()}
                </button>

                <button
                  onClick={handleTrailer}
                  style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", color: "white", border: "1px solid rgba(255,255,255,0.3)", padding: "14px 24px", borderRadius: "12px", fontWeight: 600, fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <FaFilm /> Watch Trailer
                </button>

                <button
                  onClick={handleWatchlist}
                  style={{ background: inWatchlist ? "rgba(220,38,38,0.3)" : "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", color: "white", border: inWatchlist ? "1px solid #dc2626" : "1px solid rgba(255,255,255,0.3)", padding: "14px 24px", borderRadius: "12px", fontWeight: 600, fontSize: "15px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <FaPlus /> {inWatchlist ? "✓ Saved" : "Watchlist"}
                </button>
              </div>

              {/* Hints */}
              <div style={{ marginTop: "16px" }}>
                {!user && (
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                    <FaLock style={{ fontSize: "11px" }} />
                    Please{" "}
                    <span onClick={() => navigate("/login")} style={{ color: "#dc2626", cursor: "pointer", fontWeight: 700, textDecoration: "underline" }}>login</span>
                    {" "}to watch. Trailer is free!
                  </p>
                )}
                {user && movie.isPremium && !isPremium && (
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                    <FaCrown style={{ color: "#eab308", fontSize: "11px" }} />
                    Premium movie —{" "}
                    <span onClick={() => navigate("/payment")} style={{ color: "#eab308", cursor: "pointer", fontWeight: 700, textDecoration: "underline" }}>Upgrade now</span>
                    {" "}to watch! Trailer is free.
                  </p>
                )}
                {user && (!movie.isPremium || isPremium) && (
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", margin: 0 }}>
                    ✅ {isPremium ? "💎 Premium member — enjoy watching!" : "Free movie — enjoy watching!"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Below Banner ── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 32px 60px" }}>
        {similarMovies.length > 0 && (
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 24px", color: theme.textMain }}>
              🎬 Similar Movies
            </h2>
            <div style={{ display: "flex", flexDirection: "row", gap: "10px", overflowX: "auto", overflowY: "visible", paddingBottom: "16px", paddingTop: "8px", scrollbarWidth: "thin", scrollbarColor: "#374151 transparent" }}>
              {similarMovies.map((m) => (
                <MovieCard key={m._id} movie={m} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Video Modal ── */}
      {(showTrailer || showMovie) && (
        <div
          onClick={closeModal}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.97)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: "960px", position: "relative" }}
          >
            <button
              onClick={closeModal}
              style={{ position: "absolute", top: "-48px", right: "0", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", fontSize: "14px", cursor: "pointer", fontWeight: 700, padding: "8px 20px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "6px" }}
            >
              ✕ Close
            </button>

            <div style={{ marginBottom: "12px" }}>
              <p style={{ color: "white", fontSize: "16px", fontWeight: 700, margin: "0 0 4px" }}>
                {showTrailer ? "🎬 " + movie.title : "▶ " + movie.title}
              </p>
              <p style={{ color: "#9ca3af", fontSize: "12px", margin: 0 }}>
                {showTrailer ? "Official Trailer" : "Now Playing"}
              </p>
            </div>

            <iframe
              key={showTrailer ? "trailer-frame" : "movie-frame"}
              src={getEmbedUrl(showTrailer ? movie.trailer : movie.videoUrl)}
              title={showTrailer ? movie.title + " Trailer" : movie.title + " Full Movie"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ width: "100%", height: "520px", borderRadius: "16px", border: "none", boxShadow: "0 0 80px rgba(220,38,38,0.3)", display: "block" }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
              <p style={{ color: "#6b7280", fontSize: "12px", margin: 0 }}>
                {showMovie && !showTrailer && "🎬 Enjoying? Add it to your watchlist!"}
                {showTrailer && !showMovie && "🎬 Like what you see? Watch the full movie!"}
              </p>
              {showTrailer && user && (!movie.isPremium || isPremium) && (
                <button
                  onClick={() => { setShowTrailer(false); setShowMovie(true); }}
                  style={{ background: "#dc2626", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}
                >
                  ▶ Watch Full Movie
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default MovieDetail;