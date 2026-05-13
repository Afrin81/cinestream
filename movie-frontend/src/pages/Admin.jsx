import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import {
  getAdminStats,
  getAdminUsers,
  deleteAdminUser,
  addAdminMovie,
  updateAdminMovie,
  deleteAdminMovie,
} from "../services/adminService";
import { getAllMovies } from "../services/movieService";
import { FaFilm, FaUsers, FaChartBar, FaPlus, FaEdit, FaTrash, FaStar } from "react-icons/fa";

function Admin() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab]     = useState("dashboard");
  const [stats, setStats]             = useState(null);
  const [topMovie, setTopMovie]       = useState(null);
  const [recentMovies, setRecentMovies] = useState([]);
  const [movies, setMovies]           = useState([]);
  const [users, setUsers]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showForm, setShowForm]       = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieForm, setMovieForm]     = useState({
    title: "", genre: "", year: "", duration: "",
    rating: "", isPremium: false, description: "",
    image: "", banner: "", trailer: "", videoUrl: "",
  });

  // ✅ Fetch all data from backend
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsData = await getAdminStats();
      if (statsData) {
        setStats(statsData.stats);
        setTopMovie(statsData.topMovie);
        setRecentMovies(statsData.recentMovies);
      }

      // Fetch all movies
      const moviesData = await getAllMovies();
      setMovies(moviesData);

      // Fetch all users
      const usersData = await getAdminUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
    setLoading(false);
  };

  // 🔒 Not logged in
  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <p style={{ fontSize: "48px" }}>🔒</p>
        <h2 style={{ color: theme.textMain, fontSize: "24px", fontWeight: 800, margin: 0 }}>Access Denied</h2>
        <p style={{ color: theme.textSub, margin: 0 }}>Please login to access admin panel</p>
        <button onClick={() => navigate("/login")} style={{ background: "#dc2626", color: "white", border: "none", padding: "12px 32px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>
          Login
        </button>
      </div>
    );
  }

  // 🚫 Not admin
  if (!user.isAdmin) {
    return (
      <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <p style={{ fontSize: "48px" }}>🚫</p>
        <h2 style={{ color: theme.textMain, fontSize: "24px", fontWeight: 800, margin: 0 }}>Not Authorized</h2>
        <p style={{ color: theme.textSub, margin: 0 }}>You don't have admin access</p>
        <button onClick={() => navigate("/")} style={{ background: "#dc2626", color: "white", border: "none", padding: "12px 32px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>
          Go Home
        </button>
      </div>
    );
  }

  // ── Delete Movie ──
  const handleDeleteMovie = async (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      const result = await deleteAdminMovie(id);
      if (result?.success) {
        setMovies(movies.filter((m) => m._id !== id));
        alert("Movie deleted successfully!");
      }
    }
  };

  // ── Save Movie ──
  const handleSaveMovie = async () => {
    if (!movieForm.title || !movieForm.genre) {
      alert("Title and Genre are required!");
      return;
    }

    if (editingMovie) {
      const result = await updateAdminMovie(editingMovie._id, {
        ...movieForm,
        rating: parseFloat(movieForm.rating) || 0,
        year: parseInt(movieForm.year) || 0,
      });
      if (result?.success) {
        setMovies(movies.map((m) => m._id === editingMovie._id ? result.movie : m));
        alert("Movie updated successfully!");
      }
    } else {
      const result = await addAdminMovie({
        ...movieForm,
        rating: parseFloat(movieForm.rating) || 0,
        year: parseInt(movieForm.year) || 0,
      });
      if (result?.success) {
        setMovies([result.movie, ...movies]);
        alert("Movie added successfully!");
      }
    }

    setShowForm(false);
    setEditingMovie(null);
    setMovieForm({ title: "", genre: "", year: "", duration: "", rating: "", isPremium: false, description: "", image: "", banner: "", trailer: "", videoUrl: "" });
  };

  // ── Edit Movie ──
  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setMovieForm({
      ...movie,
      rating: movie.rating.toString(),
      year: movie.year.toString(),
    });
    setShowForm(true);
    setActiveTab("movies");
  };

  // ── Delete User ──
  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Delete user ${name}?`)) {
      const result = await deleteAdminUser(id);
      if (result?.success) {
        setUsers(users.filter((u) => u._id !== id));
        alert("User deleted successfully!");
      } else {
        alert(result?.message || "Error deleting user!");
      }
    }
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard",     icon: <FaChartBar /> },
    { id: "movies",    label: "Manage Movies", icon: <FaFilm /> },
    { id: "users",     label: "Manage Users",  icon: <FaUsers /> },
  ];

  const inputStyle = {
    width: "100%", background: theme.bgInput,
    border: "1px solid " + theme.border,
    color: theme.textMain, padding: "10px 12px",
    borderRadius: "8px", fontSize: "13px",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", color: theme.textMain, paddingTop: "70px" }}>
      <div style={{ display: "flex" }}>

        {/* ── Sidebar ── */}
        <div style={{
          width: "220px", minWidth: "220px",
          background: theme.bgCard,
          borderRight: "1px solid " + theme.border,
          minHeight: "calc(100vh - 70px)",
          padding: "24px 12px",
          position: "sticky", top: "70px",
          height: "calc(100vh - 70px)",
          overflowY: "auto",
        }}>
          <p style={{ color: theme.textSub, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 12px 8px" }}>
            Admin Panel
          </p>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "12px 14px", borderRadius: "10px",
                border: "none", cursor: "pointer",
                fontWeight: 600, fontSize: "14px",
                background: activeTab === tab.id ? "#dc2626" : "transparent",
                color: activeTab === tab.id ? "white" : theme.textSub,
                transition: "all 0.2s",
                textAlign: "left", width: "100%", marginBottom: "4px",
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── Main Content ── */}
        <div style={{ flex: 1, padding: "32px", overflowX: "auto" }}>

          {/* Loading */}
          {loading ? (
            <div style={{ textAlign: "center", paddingTop: "80px" }}>
              <p style={{ color: theme.textSub, fontSize: "18px" }}>Loading data... ⏳</p>
            </div>
          ) : (
            <>

              {/* ══════════════════ */}
              {/* DASHBOARD TAB     */}
              {/* ══════════════════ */}
              {activeTab === "dashboard" && (
                <div>
                  <h1 style={{ fontSize: "26px", fontWeight: 900, margin: "0 0 4px" }}>
                    👋 Welcome, {user.name}!
                  </h1>
                  <p style={{ color: theme.textSub, margin: "0 0 32px" }}>
                    Here's your CineStream overview.
                  </p>

                  {/* Stats Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "32px" }}>
                    {[
                      { label: "Total Movies",   value: stats?.totalMovies   || 0, emoji: "🎬", color: "#3b82f6" },
                      { label: "Total Users",    value: stats?.totalUsers    || 0, emoji: "👥", color: "#22c55e" },
                      { label: "Premium Movies", value: stats?.premiumMovies || 0, emoji: "💎", color: "#eab308" },
                      { label: "Premium Users",  value: stats?.premiumUsers  || 0, emoji: "👑", color: "#a855f7" },
                    ].map((stat) => (
                      <div key={stat.label} style={{
                        background: theme.bgCard,
                        border: "1px solid " + theme.border,
                        borderRadius: "16px", padding: "20px",
                        display: "flex", alignItems: "center", gap: "14px",
                      }}>
                        <div style={{
                          width: "48px", height: "48px", borderRadius: "12px",
                          background: stat.color + "22",
                          display: "flex", alignItems: "center",
                          justifyContent: "center", fontSize: "22px", flexShrink: 0,
                        }}>
                          {stat.emoji}
                        </div>
                        <div>
                          <p style={{ color: theme.textSub, fontSize: "12px", margin: "0 0 2px" }}>{stat.label}</p>
                          <p style={{ color: theme.textMain, fontSize: "26px", fontWeight: 900, margin: 0 }}>{stat.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Top Rated Movie */}
                  {topMovie && (
                    <div style={{ background: theme.bgCard, border: "1px solid " + theme.border, borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
                      <h3 style={{ color: theme.textMain, fontWeight: 800, fontSize: "15px", margin: "0 0 14px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaStar style={{ color: "#facc15" }} /> Top Rated Movie
                      </h3>
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <img
                          src={topMovie.image}
                          alt={topMovie.title}
                          onError={(e) => { e.target.src = "https://placehold.co/50x70/1a1a2e/ffffff?text=M"; }}
                          style={{ width: "50px", height: "70px", objectFit: "cover", borderRadius: "8px" }}
                        />
                        <div>
                          <p style={{ color: theme.textMain, fontWeight: 800, fontSize: "16px", margin: "0 0 4px" }}>{topMovie.title}</p>
                          <p style={{ color: theme.textSub, fontSize: "13px", margin: "0 0 4px" }}>{topMovie.genre} • {topMovie.year}</p>
                          <p style={{ color: "#facc15", fontWeight: 700, fontSize: "14px", margin: 0 }}>⭐ {topMovie.rating} / 5.0</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recent Movies */}
                  <div style={{ background: theme.bgCard, border: "1px solid " + theme.border, borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
                    <h3 style={{ color: theme.textMain, fontWeight: 800, fontSize: "15px", margin: "0 0 16px" }}>
                      🎬 Recent Movies
                    </h3>
                    {recentMovies.map((movie, index) => (
                      <div key={movie._id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: index < recentMovies.length - 1 ? "1px solid " + theme.border : "none" }}>
                        <img
                          src={movie.image}
                          onError={(e) => { e.target.src = "https://placehold.co/36x50/1a1a2e/ffffff?text=M"; }}
                          style={{ width: "36px", height: "50px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }}
                        />
                        <div style={{ flex: 1 }}>
                          <p style={{ color: theme.textMain, fontWeight: 700, fontSize: "14px", margin: "0 0 2px" }}>{movie.title}</p>
                          <p style={{ color: theme.textSub, fontSize: "12px", margin: 0 }}>{movie.genre} • {movie.year}</p>
                        </div>
                        <span style={{ color: "#facc15", fontSize: "13px", fontWeight: 700 }}>⭐ {movie.rating}</span>
                        {movie.isPremium && (
                          <span style={{ background: "#eab30822", color: "#eab308", fontSize: "10px", padding: "2px 8px", borderRadius: "999px", fontWeight: 700 }}>💎</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Recent Users */}
                  <div style={{ background: theme.bgCard, border: "1px solid " + theme.border, borderRadius: "16px", padding: "20px" }}>
                    <h3 style={{ color: theme.textMain, fontWeight: 800, fontSize: "15px", margin: "0 0 16px" }}>
                      👥 Recent Users
                    </h3>
                    {users.slice(0, 5).map((u, index) => (
                      <div key={u._id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: index < 4 ? "1px solid " + theme.border : "none" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: "14px", flexShrink: 0 }}>
                          {u.name.charAt(0)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ color: theme.textMain, fontWeight: 700, fontSize: "14px", margin: "0 0 2px" }}>{u.name}</p>
                          <p style={{ color: theme.textSub, fontSize: "12px", margin: 0 }}>{u.email}</p>
                        </div>
                        {u.isPremium ? (
                          <span style={{ background: "#eab30822", color: "#eab308", fontSize: "11px", padding: "3px 10px", borderRadius: "999px", fontWeight: 700 }}>💎 Premium</span>
                        ) : (
                          <span style={{ background: theme.bgInput, color: theme.textSub, fontSize: "11px", padding: "3px 10px", borderRadius: "999px" }}>Free</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ══════════════════ */}
              {/* MOVIES TAB        */}
              {/* ══════════════════ */}
              {activeTab === "movies" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
                    <h1 style={{ fontSize: "24px", fontWeight: 900, margin: 0 }}>🎬 Manage Movies</h1>
                    <button
                      onClick={() => {
                        setShowForm(true);
                        setEditingMovie(null);
                        setMovieForm({ title: "", genre: "", year: "", duration: "", rating: "", isPremium: false, description: "", image: "", banner: "", trailer: "", videoUrl: "" });
                      }}
                      style={{ background: "#dc2626", color: "white", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                    >
                      <FaPlus /> Add Movie
                    </button>
                  </div>

                  {/* Add/Edit Form */}
                  {showForm && (
                    <div style={{ background: theme.bgCard, border: "1px solid " + theme.border, borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
                      <h3 style={{ color: theme.textMain, fontWeight: 800, fontSize: "16px", margin: "0 0 20px" }}>
                        {editingMovie ? "✏️ Edit Movie" : "➕ Add New Movie"}
                      </h3>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "14px" }}>
                        {[
                          { label: "Title *",      key: "title",    placeholder: "Movie title" },
                          { label: "Genre *",      key: "genre",    placeholder: "Action, Comedy..." },
                          { label: "Year",         key: "year",     placeholder: "2024" },
                          { label: "Duration",     key: "duration", placeholder: "2h 30m" },
                          { label: "Rating",       key: "rating",   placeholder: "4.5" },
                          { label: "Image URL",    key: "image",    placeholder: "https://..." },
                          { label: "Banner URL",   key: "banner",   placeholder: "https://..." },
                          { label: "Trailer URL",  key: "trailer",  placeholder: "https://youtube.com/embed/..." },
                          { label: "Video URL",    key: "videoUrl", placeholder: "https://youtube.com/embed/..." },
                        ].map((field) => (
                          <div key={field.key}>
                            <label style={{ color: theme.textSub, fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }}>{field.label}</label>
                            <input
                              type="text"
                              placeholder={field.placeholder}
                              value={movieForm[field.key]}
                              onChange={(e) => setMovieForm({ ...movieForm, [field.key]: e.target.value })}
                              style={inputStyle}
                            />
                          </div>
                        ))}
                      </div>

                      <div style={{ marginBottom: "14px" }}>
                        <label style={{ color: theme.textSub, fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }}>Description</label>
                        <textarea
                          placeholder="Movie description..."
                          value={movieForm.description}
                          onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                          rows={3}
                          style={{ ...inputStyle, resize: "vertical" }}
                        />
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                        <input
                          type="checkbox"
                          id="isPremium"
                          checked={movieForm.isPremium}
                          onChange={(e) => setMovieForm({ ...movieForm, isPremium: e.target.checked })}
                          style={{ width: "16px", height: "16px", cursor: "pointer" }}
                        />
                        <label htmlFor="isPremium" style={{ color: theme.textMain, fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                          💎 Premium Movie
                        </label>
                      </div>

                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          onClick={handleSaveMovie}
                          style={{ background: "#dc2626", color: "white", border: "none", padding: "10px 24px", borderRadius: "10px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}
                        >
                          {editingMovie ? "✓ Save Changes" : "✓ Add Movie"}
                        </button>
                        <button
                          onClick={() => { setShowForm(false); setEditingMovie(null); }}
                          style={{ background: theme.bgInput, color: theme.textMain, border: "1px solid " + theme.border, padding: "10px 24px", borderRadius: "10px", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Movies Table */}
                  <div style={{ background: theme.bgCard, border: "1px solid " + theme.border, borderRadius: "16px", overflow: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                      <thead>
                        <tr style={{ background: theme.bgInput }}>
                          {["Poster", "Title", "Genre", "Year", "Rating", "Type", "Actions"].map((h) => (
                            <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: theme.textSub, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {movies.map((movie, index) => (
                          <tr key={movie._id} style={{ borderTop: index > 0 ? "1px solid " + theme.border : "none" }}>
                            <td style={{ padding: "10px 16px" }}>
                              <img
                                src={movie.image}
                                onError={(e) => { e.target.src = "https://placehold.co/36x50/1a1a2e/ffffff?text=M"; }}
                                style={{ width: "36px", height: "50px", objectFit: "cover", borderRadius: "6px" }}
                              />
                            </td>
                            <td style={{ padding: "10px 16px", color: theme.textMain, fontWeight: 700, fontSize: "14px" }}>{movie.title}</td>
                            <td style={{ padding: "10px 16px" }}>
                              <span style={{ background: "#dc262622", color: "#dc2626", fontSize: "11px", padding: "3px 10px", borderRadius: "999px", fontWeight: 600 }}>{movie.genre}</span>
                            </td>
                            <td style={{ padding: "10px 16px", color: theme.textSub, fontSize: "14px" }}>{movie.year}</td>
                            <td style={{ padding: "10px 16px", color: "#facc15", fontWeight: 700, fontSize: "14px" }}>⭐ {movie.rating}</td>
                            <td style={{ padding: "10px 16px" }}>
                              {movie.isPremium ? (
                                <span style={{ background: "#eab30822", color: "#eab308", fontSize: "11px", padding: "3px 10px", borderRadius: "999px", fontWeight: 700 }}>💎 Premium</span>
                              ) : (
                                <span style={{ background: theme.bgInput, color: theme.textSub, fontSize: "11px", padding: "3px 10px", borderRadius: "999px" }}>Free</span>
                              )}
                            </td>
                            <td style={{ padding: "10px 16px" }}>
                              <div style={{ display: "flex", gap: "6px" }}>
                                <button
                                  onClick={() => handleEditMovie(movie)}
                                  style={{ background: "#3b82f622", color: "#3b82f6", border: "1px solid #3b82f6", padding: "5px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                                >
                                  <FaEdit /> Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteMovie(movie._id)}
                                  style={{ background: "#ef444422", color: "#ef4444", border: "1px solid #ef4444", padding: "5px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                                >
                                  <FaTrash /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ══════════════════ */}
              {/* USERS TAB         */}
              {/* ══════════════════ */}
              {activeTab === "users" && (
                <div>
                  <h1 style={{ fontSize: "24px", fontWeight: 900, margin: "0 0 24px" }}>
                    👥 Manage Users ({users.length})
                  </h1>
                  <div style={{ background: theme.bgCard, border: "1px solid " + theme.border, borderRadius: "16px", overflow: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
                      <thead>
                        <tr style={{ background: theme.bgInput }}>
                          {["#", "Name", "Email", "Plan", "Admin", "Joined", "Actions"].map((h) => (
                            <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: theme.textSub, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u, index) => (
                          <tr key={u._id} style={{ borderTop: index > 0 ? "1px solid " + theme.border : "none" }}>
                            <td style={{ padding: "14px 16px", color: theme.textSub, fontSize: "14px" }}>{index + 1}</td>
                            <td style={{ padding: "14px 16px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: "14px", flexShrink: 0 }}>
                                  {u.name.charAt(0)}
                                </div>
                                <span style={{ color: theme.textMain, fontWeight: 700, fontSize: "14px" }}>{u.name}</span>
                              </div>
                            </td>
                            <td style={{ padding: "14px 16px", color: theme.textSub, fontSize: "13px" }}>{u.email}</td>
                            <td style={{ padding: "14px 16px" }}>
                              {u.isPremium ? (
                                <span style={{ background: "#eab30822", color: "#eab308", fontSize: "11px", padding: "3px 10px", borderRadius: "999px", fontWeight: 700 }}>💎 Premium</span>
                              ) : (
                                <span style={{ background: theme.bgInput, color: theme.textSub, fontSize: "11px", padding: "3px 10px", borderRadius: "999px" }}>Free</span>
                              )}
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              {u.isAdmin ? (
                                <span style={{ background: "#dc262622", color: "#dc2626", fontSize: "11px", padding: "3px 10px", borderRadius: "999px", fontWeight: 700 }}>👑 Admin</span>
                              ) : (
                                <span style={{ color: theme.textSub, fontSize: "13px" }}>—</span>
                              )}
                            </td>
                            <td style={{ padding: "14px 16px", color: theme.textSub, fontSize: "13px" }}>
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              {!u.isAdmin && (
                                <button
                                  onClick={() => handleDeleteUser(u._id, u.name)}
                                  style={{ background: "#ef444422", color: "#ef4444", border: "1px solid #ef4444", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                                >
                                  <FaTrash /> Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;