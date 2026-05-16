import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useWatchlist } from "../context/WatchlistContext";
import { getAllMovies } from "../services/movieService";
import { FaUser, FaCrown, FaFilm, FaHeart, FaStar, FaPlay, FaHistory } from "react-icons/fa";

function Dashboard() {
  const { theme } = useTheme();
  const { user, isPremium } = useAuth();
  const { watchlist } = useWatchlist();
  const navigate = useNavigate();

  const [activeTab, setActiveTab]             = useState("overview");
  const [allMovies, setAllMovies]             = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [recentlyWatched, setRecentlyWatched] = useState([]);

  // ✅ Fetch all movies
  useEffect(() => {
    const fetchMovies = async () => {
      const movies = await getAllMovies();
      setAllMovies(movies);
      setLoading(false);
    };
    fetchMovies();
  }, []);

  // ✅ Load recently watched from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recentlyWatched") || "[]");
    setRecentlyWatched(saved);
  }, []);

  // 🔒 Not logged in
  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <p style={{ fontSize: "48px" }}>🔒</p>
        <h2 style={{ color: theme.textMain, fontSize: "24px", fontWeight: 800, margin: 0 }}>Please Login</h2>
        <button onClick={() => navigate("/login")} style={{ background: "#dc2626", color: "white", border: "none", padding: "12px 32px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>
          Login
        </button>
      </div>
    );
  }

  const tabs = [
    { id: "overview",  label: "Overview",  icon: <FaUser /> },
    { id: "watchlist", label: "Watchlist", icon: <FaHeart /> },
    { id: "history",   label: "History",   icon: <FaHistory /> },
    { id: "movies",    label: "Movies",    icon: <FaFilm /> },
  ];

  // ✅ Get recommended movies based on watchlist genres
  const getRecommended = () => {
    if (watchlist.length === 0) return allMovies.slice(0, 4);
    const genres = watchlist.map(m => m.genre);
    const recommended = allMovies.filter(m =>
      genres.includes(m.genre) && !watchlist.find(w => w._id === m._id)
    );
    return recommended.slice(0, 4);
  };

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", paddingTop: "90px", paddingBottom: "60px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>

        {/* ── Profile Header ── */}
        <div style={{
          background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
          borderRadius: "20px",
          padding: "32px",
          marginBottom: "32px",
          display: "flex",
          alignItems: "center",
          gap: "24px",
          flexWrap: "wrap",
        }}>
          {/* Avatar */}
          <div style={{
            width: "80px", height: "80px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center",
            justifyContent: "center",
            fontSize: "32px", fontWeight: 900,
            color: "white", flexShrink: 0,
            border: "3px solid rgba(255,255,255,0.3)",
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <h1 style={{ color: "white", fontSize: "24px", fontWeight: 900, margin: "0 0 4px" }}>
              {user.name}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", margin: "0 0 12px" }}>
              {user.email}
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {isPremium ? (
                <span style={{ background: "#eab308", color: "black", fontSize: "12px", padding: "4px 12px", borderRadius: "999px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                  <FaCrown /> Premium Member
                </span>
              ) : (
                <span style={{ background: "rgba(255,255,255,0.2)", color: "white", fontSize: "12px", padding: "4px 12px", borderRadius: "999px", fontWeight: 600 }}>
                  Free Member
                </span>
              )}
              {user.isAdmin && (
                <span style={{ background: "#7c3aed", color: "white", fontSize: "12px", padding: "4px 12px", borderRadius: "999px", fontWeight: 700 }}>
                  👑 Admin
                </span>
              )}
            </div>
          </div>

          {/* Upgrade button for free users */}
          {!isPremium && (
            <button
              onClick={() => navigate("/payment")}
              style={{ background: "#eab308", color: "black", border: "none", padding: "12px 24px", borderRadius: "12px", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
            >
              <FaCrown /> Upgrade to Premium
            </button>
          )}
        </div>

        {/* ── Stats Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Watchlist",   value: watchlist.length,        emoji: "🎬", color: "#3b82f6" },
            { label: "Watched",     value: recentlyWatched.length,  emoji: "▶️", color: "#22c55e" },
            { label: "Plan",        value: isPremium ? "Premium" : "Free", emoji: isPremium ? "💎" : "🆓", color: isPremium ? "#eab308" : "#6b7280" },
            { label: "Status",      value: "Active",                emoji: "✅", color: "#10b981" },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: theme.bgCard,
              border: "1px solid " + theme.border,
              borderRadius: "16px",
              padding: "20px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>{stat.emoji}</div>
              <p style={{ color: theme.textSub, fontSize: "12px", margin: "0 0 4px", fontWeight: 600, textTransform: "uppercase" }}>{stat.label}</p>
              <p style={{ color: stat.color, fontSize: "20px", fontWeight: 900, margin: 0 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", borderBottom: "1px solid " + theme.border, paddingBottom: "0" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "12px 20px",
                border: "none",
                borderBottom: activeTab === tab.id ? "2px solid #dc2626" : "2px solid transparent",
                background: "transparent",
                color: activeTab === tab.id ? "#dc2626" : theme.textSub,
                fontWeight: activeTab === tab.id ? 700 : 600,
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s",
                marginBottom: "-1px",
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ══════════════════ */}
        {/* OVERVIEW TAB      */}
        {/* ══════════════════ */}
        {activeTab === "overview" && (
          <div>
            {/* Account Info */}
            <div style={{ background: theme.bgCard, border: "1px solid " + theme.border, borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ color: theme.textMain, fontWeight: 800, fontSize: "16px", margin: "0 0 20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaUser style={{ color: "#dc2626" }} /> Account Information
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                {[
                  { label: "Full Name",     value: user.name },
                  { label: "Email",         value: user.email },
                  { label: "Membership",    value: isPremium ? "💎 Premium" : "🆓 Free" },
                  { label: "Account Type",  value: user.isAdmin ? "👑 Admin" : "👤 User" },
                ].map((item) => (
                  <div key={item.label} style={{ background: theme.bgInput, borderRadius: "12px", padding: "16px" }}>
                    <p style={{ color: theme.textSub, fontSize: "12px", fontWeight: 600, margin: "0 0 6px", textTransform: "uppercase" }}>{item.label}</p>
                    <p style={{ color: theme.textMain, fontSize: "15px", fontWeight: 700, margin: 0 }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ Recently Watched */}
            {recentlyWatched.length > 0 && (
              <div style={{ background: theme.bgCard, border: "1px solid " + theme.border, borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
                <h3 style={{ color: theme.textMain, fontWeight: 800, fontSize: "16px", margin: "0 0 20px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FaHistory style={{ color: "#dc2626" }} /> Recently Watched
                </h3>
                <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "8px" }}>
                  {recentlyWatched.slice(0, 6).map((movie) => (
                    <div
                      key={movie._id}
                      onClick={() => navigate("/movie/" + movie._id)}
                      style={{ minWidth: "140px", cursor: "pointer" }}
                    >
                      <div style={{ position: "relative" }}>
                        <img
                          src={movie.image}
                          alt={movie.title}
                          onError={(e) => { e.target.src = "https://placehold.co/140x200/1a1a2e/ffffff?text=" + encodeURIComponent(movie.title); }}
                          style={{ width: "140px", height: "200px", objectFit: "cover", borderRadius: "10px", display: "block", marginBottom: "8px" }}
                        />
                        <div style={{ position: "absolute", inset: 0, borderRadius: "10px", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                        >
                          <FaPlay style={{ color: "white", fontSize: "24px" }} />
                        </div>
                      </div>
                      <p style={{ color: theme.textMain, fontSize: "12px", fontWeight: 700, margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "140px" }}>
                        {movie.title}
                      </p>
                      <p style={{ color: theme.textSub, fontSize: "11px", margin: 0 }}>⭐ {movie.rating}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Movies */}
            <div style={{ background: theme.bgCard, border: "1px solid " + theme.border, borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
              <h3 style={{ color: theme.textMain, fontWeight: 800, fontSize: "16px", margin: "0 0 20px", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaStar style={{ color: "#facc15" }} /> Recommended For You
              </h3>
              {loading ? (
                <p style={{ color: theme.textSub }}>Loading...</p>
              ) : (
                <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "8px" }}>
                  {getRecommended().map((movie) => (
                    <div
                      key={movie._id}
                      onClick={() => navigate("/movie/" + movie._id)}
                      style={{ minWidth: "140px", cursor: "pointer" }}
                    >
                      <img
                        src={movie.image}
                        alt={movie.title}
                        onError={(e) => { e.target.src = "https://placehold.co/140x200/1a1a2e/ffffff?text=" + encodeURIComponent(movie.title); }}
                        style={{ width: "140px", height: "200px", objectFit: "cover", borderRadius: "10px", display: "block", marginBottom: "8px" }}
                      />
                      <p style={{ color: theme.textMain, fontSize: "12px", fontWeight: 700, margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "140px" }}>
                        {movie.title}
                      </p>
                      <p style={{ color: theme.textSub, fontSize: "11px", margin: 0 }}>⭐ {movie.rating}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div style={{ background: theme.bgCard, border: "1px solid " + theme.border, borderRadius: "16px", padding: "24px" }}>
              <h3 style={{ color: theme.textMain, fontWeight: 800, fontSize: "16px", margin: "0 0 20px" }}>
                ⚡ Quick Actions
              </h3>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                {[
                  { label: "Browse Movies",   icon: "🎬", action: () => navigate("/movies") },
                  { label: "My Watchlist",    icon: "❤️", action: () => setActiveTab("watchlist") },
                  { label: "Watch History",   icon: "▶️", action: () => setActiveTab("history") },
                  { label: "Upgrade Plan",    icon: "💎", action: () => navigate("/payment"), hide: isPremium },
                ].filter(a => !a.hide).map((action) => (
                  <button
                    key={action.label}
                    onClick={action.action}
                    style={{
                      background: theme.bgInput,
                      color: theme.textMain,
                      border: "1px solid " + theme.border,
                      padding: "12px 20px",
                      borderRadius: "12px",
                      fontWeight: 600,
                      fontSize: "14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {action.icon} {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════ */}
        {/* WATCHLIST TAB     */}
        {/* ══════════════════ */}
        {activeTab === "watchlist" && (
          <div>
            <h2 style={{ color: theme.textMain, fontSize: "20px", fontWeight: 800, margin: "0 0 20px" }}>
              ❤️ My Watchlist ({watchlist.length} movies)
            </h2>

            {watchlist.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 24px", background: theme.bgCard, borderRadius: "16px", border: "1px solid " + theme.border }}>
                <p style={{ fontSize: "48px", margin: "0 0 16px" }}>🎬</p>
                <p style={{ color: theme.textMain, fontSize: "18px", fontWeight: 700, margin: "0 0 8px" }}>Your watchlist is empty</p>
                <p style={{ color: theme.textSub, fontSize: "14px", margin: "0 0 20px" }}>Add movies to watch later</p>
                <button
                  onClick={() => navigate("/movies")}
                  style={{ background: "#dc2626", color: "white", border: "none", padding: "10px 24px", borderRadius: "10px", fontWeight: 700, cursor: "pointer" }}
                >
                  Browse Movies
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {watchlist.map((movie) => (
                  <div
                    key={movie._id}
                    style={{
                      background: theme.bgCard,
                      border: "1px solid " + theme.border,
                      borderRadius: "14px",
                      overflow: "hidden",
                      display: "flex",
                      gap: "0",
                      transition: "box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.2)"}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
                  >
                    <img
                      src={movie.image}
                      alt={movie.title}
                      onClick={() => navigate("/movie/" + movie._id)}
                      onError={(e) => { e.target.src = "https://placehold.co/80x110/1a1a2e/ffffff?text=M"; }}
                      style={{ width: "80px", height: "110px", objectFit: "cover", cursor: "pointer", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                      <div>
                        <h3
                          onClick={() => navigate("/movie/" + movie._id)}
                          style={{ color: theme.textMain, fontWeight: 700, fontSize: "16px", margin: "0 0 6px", cursor: "pointer" }}
                        >
                          {movie.title}
                        </h3>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{ background: "#dc262622", color: "#dc2626", fontSize: "11px", padding: "2px 8px", borderRadius: "999px", fontWeight: 600 }}>{movie.genre}</span>
                          <span style={{ color: theme.textSub, fontSize: "12px" }}>{movie.year}</span>
                          <span style={{ color: "#facc15", fontSize: "12px", fontWeight: 700 }}>⭐ {movie.rating}</span>
                          {movie.isPremium && (
                            <span style={{ background: "#eab30822", color: "#eab308", fontSize: "11px", padding: "2px 8px", borderRadius: "999px", fontWeight: 700 }}>💎</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => navigate("/movie/" + movie._id + "?tab=watch")}
                        style={{ background: "#dc2626", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: 700, fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                      >
                        <FaPlay /> Watch
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════ */}
        {/* HISTORY TAB       */}
        {/* ══════════════════ */}
        {activeTab === "history" && (
          <div>
            <h2 style={{ color: theme.textMain, fontSize: "20px", fontWeight: 800, margin: "0 0 20px" }}>
              ▶️ Watch History ({recentlyWatched.length} movies)
            </h2>

            {recentlyWatched.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 24px", background: theme.bgCard, borderRadius: "16px", border: "1px solid " + theme.border }}>
                <p style={{ fontSize: "48px", margin: "0 0 16px" }}>▶️</p>
                <p style={{ color: theme.textMain, fontSize: "18px", fontWeight: 700, margin: "0 0 8px" }}>No watch history yet</p>
                <p style={{ color: theme.textSub, fontSize: "14px", margin: "0 0 20px" }}>Start watching movies!</p>
                <button
                  onClick={() => navigate("/movies")}
                  style={{ background: "#dc2626", color: "white", border: "none", padding: "10px 24px", borderRadius: "10px", fontWeight: 700, cursor: "pointer" }}
                >
                  Browse Movies
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {recentlyWatched.map((movie) => (
                  <div
                    key={movie._id}
                    style={{
                      background: theme.bgCard,
                      border: "1px solid " + theme.border,
                      borderRadius: "14px",
                      overflow: "hidden",
                      display: "flex",
                      transition: "box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.2)"}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
                  >
                    <img
                      src={movie.image}
                      alt={movie.title}
                      onClick={() => navigate("/movie/" + movie._id)}
                      onError={(e) => { e.target.src = "https://placehold.co/80x110/1a1a2e/ffffff?text=M"; }}
                      style={{ width: "80px", height: "110px", objectFit: "cover", cursor: "pointer", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                      <div>
                        <h3
                          onClick={() => navigate("/movie/" + movie._id)}
                          style={{ color: theme.textMain, fontWeight: 700, fontSize: "16px", margin: "0 0 6px", cursor: "pointer" }}
                        >
                          {movie.title}
                        </h3>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{ background: "#dc262622", color: "#dc2626", fontSize: "11px", padding: "2px 8px", borderRadius: "999px", fontWeight: 600 }}>{movie.genre}</span>
                          <span style={{ color: theme.textSub, fontSize: "12px" }}>{movie.year}</span>
                          <span style={{ color: "#facc15", fontSize: "12px", fontWeight: 700 }}>⭐ {movie.rating}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate("/movie/" + movie._id + "?tab=watch")}
                        style={{ background: "#dc2626", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: 700, fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                      >
                        <FaPlay /> Watch Again
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════ */}
        {/* MOVIES TAB        */}
        {/* ══════════════════ */}
        {activeTab === "movies" && (
          <div>
            <h2 style={{ color: theme.textMain, fontSize: "20px", fontWeight: 800, margin: "0 0 20px" }}>
              🎬 All Available Movies
            </h2>

            {loading ? (
              <p style={{ color: theme.textSub }}>Loading...</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "16px" }}>
                {allMovies.map((movie) => (
                  <div
                    key={movie._id}
                    onClick={() => navigate("/movie/" + movie._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div style={{ position: "relative" }}>
                      <img
                        src={movie.image}
                        alt={movie.title}
                        onError={(e) => { e.target.src = "https://placehold.co/140x200/1a1a2e/ffffff?text=" + encodeURIComponent(movie.title); }}
                        style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px", display: "block" }}
                      />
                      {movie.isPremium && (
                        <div style={{ position: "absolute", top: "6px", left: "6px", background: "#eab308", color: "black", fontSize: "9px", padding: "2px 6px", borderRadius: "999px", fontWeight: 700 }}>
                          💎
                        </div>
                      )}
                      {watchlist.find(w => w._id === movie._id) && (
                        <div style={{ position: "absolute", top: "6px", right: "6px", background: "#dc2626", color: "white", fontSize: "9px", padding: "2px 6px", borderRadius: "999px", fontWeight: 700 }}>
                          ❤️
                        </div>
                      )}
                    </div>
                    <p style={{ color: theme.textMain, fontSize: "12px", fontWeight: 700, margin: "8px 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {movie.title}
                    </p>
                    <p style={{ color: theme.textSub, fontSize: "11px", margin: 0 }}>
                      {movie.genre} • ⭐ {movie.rating}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;