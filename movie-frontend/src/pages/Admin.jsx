import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import {
  getAdminStats, getAdminUsers, deleteAdminUser,
  addAdminMovie, updateAdminMovie, deleteAdminMovie,
} from "../services/adminService";
import { getAllMovies, getMostWatched } from "../services/movieService";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart,
  Line, Legend,
} from "recharts";
import {
  FaFilm, FaUsers, FaChartBar, FaPlus, FaEdit, FaTrash,
  FaStar, FaFire, FaCheckCircle, FaTimesCircle, FaSearch,
  FaCrown, FaMoneyBillWave, FaEye,
} from "react-icons/fa";

// ✅ Revenue calculation helpers
const MONTHLY_PRICE = 199;
const YEARLY_PRICE  = 1499;

function Admin() {
  const { theme } = useTheme();
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [activeTab, setActiveTab]           = useState("dashboard");
  const [stats, setStats]                   = useState(null);
  const [topMovie, setTopMovie]             = useState(null);
  const [recentMovies, setRecentMovies]     = useState([]);
  const [movies, setMovies]                 = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [users, setUsers]                   = useState([]);
  const [filteredUsers, setFilteredUsers]   = useState([]);
  const [mostWatched, setMostWatched]       = useState([]);
  const [loading, setLoading]               = useState(true);
  const [showForm, setShowForm]             = useState(false);
  const [editingMovie, setEditingMovie]     = useState(null);
  const [movieSearch, setMovieSearch]       = useState("");
  const [userSearch, setUserSearch]         = useState("");
  const [successMsg, setSuccessMsg]         = useState("");
  const [errorMsg, setErrorMsg]             = useState("");
  const [movieForm, setMovieForm]           = useState({
    title: "", genre: "", year: "", duration: "",
    rating: "", isPremium: false, description: "",
    image: "", banner: "", trailer: "", videoUrl: "",
    downloadUrl: "", mood: "",
  });

  useEffect(() => { fetchAllData(); }, []);

  useEffect(() => {
    setFilteredMovies(movies.filter(m =>
      m.title.toLowerCase().includes(movieSearch.toLowerCase()) ||
      m.genre.toLowerCase().includes(movieSearch.toLowerCase())
    ));
  }, [movieSearch, movies]);

  useEffect(() => {
    setFilteredUsers(users.filter(u =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
    ));
  }, [userSearch, users]);

  const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(""), 3000); };
  const showError   = (msg) => { setErrorMsg(msg);   setTimeout(() => setErrorMsg(""), 3000); };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const statsData = await getAdminStats();
      if (statsData) {
        setStats(statsData.stats);
        setTopMovie(statsData.topMovie);
        setRecentMovies(statsData.recentMovies);
      }
      const moviesData = await getAllMovies();
      setMovies(moviesData);
      setFilteredMovies(moviesData);
      const usersData = await getAdminUsers();
      setUsers(usersData);
      setFilteredUsers(usersData);
      const watchedData = await getMostWatched(30);
      setMostWatched(watchedData);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (!user) return (
    <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
      <p style={{ fontSize: "48px" }}>🔒</p>
      <h2 style={{ color: theme.textMain, fontWeight: 800, margin: 0 }}>Access Denied</h2>
      <button onClick={() => navigate("/login")} style={{ background: "#dc2626", color: "white", border: "none", padding: "12px 32px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>Login</button>
    </div>
  );

  if (!user.isAdmin) return (
    <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
      <p style={{ fontSize: "48px" }}>🚫</p>
      <h2 style={{ color: theme.textMain, fontWeight: 800, margin: 0 }}>Not Authorized</h2>
      <button onClick={() => navigate("/")} style={{ background: "#dc2626", color: "white", border: "none", padding: "12px 32px", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>Go Home</button>
    </div>
  );

  // ── Revenue data (simulated from premium users) ──
  const totalRevenue     = (stats?.premiumUsers || 0) * MONTHLY_PRICE;
  const yearlyRevenue    = Math.floor((stats?.premiumUsers || 0) * 0.3) * YEARLY_PRICE;
  const monthlyRevenue   = Math.floor((stats?.premiumUsers || 0) * 0.7) * MONTHLY_PRICE;

  // ── Monthly revenue chart data (last 6 months) ──
  const revenueChartData = (() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const base = Math.floor(Math.random() * 5 + 2);
      return {
        month: months[d.getMonth()],
        revenue: base * MONTHLY_PRICE + Math.floor(Math.random() * 2) * YEARLY_PRICE,
        users: base + Math.floor(Math.random() * 3),
        premium: base,
      };
    });
  })();

  // ── Genre distribution ──
  const genreData = (() => {
    const count = {};
    movies.forEach(m => { count[m.genre] = (count[m.genre] || 0) + 1; });
    return Object.entries(count)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  })();

  const PIE_COLORS = ["#dc2626", "#3b82f6", "#22c55e", "#eab308", "#a855f7", "#f97316", "#06b6d4", "#ec4899"];

  // ── User plan distribution ──
  const planData = [
    { name: "Premium", value: stats?.premiumUsers || 0, color: "#eab308" },
    { name: "Free",    value: (stats?.totalUsers || 0) - (stats?.premiumUsers || 0), color: "#6b7280" },
  ];

  const handleDeleteMovie = async (id) => {
    if (window.confirm("Delete this movie?")) {
      const result = await deleteAdminMovie(id);
      if (result?.success) { setMovies(movies.filter(m => m._id !== id)); showSuccess("Movie deleted!"); }
      else showError("Failed to delete movie!");
    }
  };

  const handleSaveMovie = async () => {
    if (!movieForm.title || !movieForm.genre) { showError("Title and Genre are required!"); return; }
    const moodArray = movieForm.mood ? movieForm.mood.split(",").map(m => m.trim()).filter(Boolean) : [];
    const payload = { ...movieForm, rating: parseFloat(movieForm.rating) || 0, year: parseInt(movieForm.year) || 0, mood: moodArray };
    if (editingMovie) {
      const result = await updateAdminMovie(editingMovie._id, payload);
      if (result?.success) { setMovies(movies.map(m => m._id === editingMovie._id ? result.movie : m)); showSuccess("Movie updated!"); }
      else showError("Failed to update!");
    } else {
      const result = await addAdminMovie(payload);
      if (result?.success) { setMovies([result.movie, ...movies]); showSuccess("Movie added!"); }
      else showError("Failed to add movie!");
    }
    setShowForm(false); setEditingMovie(null);
    setMovieForm({ title: "", genre: "", year: "", duration: "", rating: "", isPremium: false, description: "", image: "", banner: "", trailer: "", videoUrl: "", downloadUrl: "", mood: "" });
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setMovieForm({ ...movie, rating: movie.rating.toString(), year: movie.year.toString(), mood: Array.isArray(movie.mood) ? movie.mood.join(", ") : "" });
    setShowForm(true); setActiveTab("movies"); window.scrollTo(0, 0);
  };

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Delete user ${name}?`)) {
      const result = await deleteAdminUser(id);
      if (result?.success) { setUsers(users.filter(u => u._id !== id)); showSuccess("User deleted!"); }
      else showError(result?.message || "Error deleting user!");
    }
  };

  const tabs = [
    { id: "dashboard",  label: "Dashboard",     icon: <FaChartBar /> },
    { id: "revenue",    label: "Revenue",        icon: <FaMoneyBillWave /> },
    { id: "analytics",  label: "Analytics",      icon: <FaFire /> },
    { id: "movies",     label: "Manage Movies",  icon: <FaFilm /> },
    { id: "users",      label: "Manage Users",   icon: <FaUsers /> },
  ];

  const inputStyle = {
    width: "100%", background: theme.bgInput,
    border: "1px solid " + theme.border,
    color: theme.textMain, padding: "10px 12px",
    borderRadius: "8px", fontSize: "13px",
    outline: "none", boxSizing: "border-box",
  };

  const cardStyle = {
    background: theme.bgCard,
    border: "1px solid " + theme.border,
    borderRadius: "16px", padding: "20px",
  };

  const tooltipStyle = {
    contentStyle: { background: theme.bgCard, border: "1px solid " + theme.border, borderRadius: "10px", color: theme.textMain },
    labelStyle: { color: theme.textMain, fontWeight: 700 },
  };

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", color: theme.textMain, paddingTop: "70px" }}>

      {/* Toast */}
      {successMsg && (
        <div style={{ position: "fixed", top: "80px", right: "24px", background: "#22c55e", color: "white", padding: "12px 20px", borderRadius: "10px", fontWeight: 700, fontSize: "14px", zIndex: 9999, display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
          <FaCheckCircle /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div style={{ position: "fixed", top: "80px", right: "24px", background: "#ef4444", color: "white", padding: "12px 20px", borderRadius: "10px", fontWeight: 700, fontSize: "14px", zIndex: 9999, display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 8px 24px rgba(0,0,0,0.3)" }}>
          <FaTimesCircle /> {errorMsg}
        </div>
      )}

      <div style={{ display: "flex" }}>

        {/* ── Sidebar ── */}
        <div style={{ width: "240px", minWidth: "240px", background: theme.bgCard, borderRight: "1px solid " + theme.border, minHeight: "calc(100vh - 70px)", padding: "24px 12px", position: "sticky", top: "70px", height: "calc(100vh - 70px)", overflowY: "auto" }}>

          {/* Admin Profile */}
          <div style={{ padding: "16px", background: "linear-gradient(135deg, #dc2626, #991b1b)", borderRadius: "12px", marginBottom: "20px", textAlign: "center" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 900, color: "white", margin: "0 auto 8px", border: "2px solid rgba(255,255,255,0.3)" }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <p style={{ color: "white", fontWeight: 800, fontSize: "14px", margin: "0 0 2px" }}>{user.name}</p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", margin: "0 0 8px" }}>👑 Administrator</p>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "8px", padding: "8px" }}>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "10px", margin: "0 0 2px" }}>Total Revenue</p>
              <p style={{ color: "white", fontSize: "16px", fontWeight: 900, margin: 0 }}>৳{totalRevenue.toLocaleString()}</p>
            </div>
          </div>

          <p style={{ color: theme.textSub, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px 8px" }}>Navigation</p>

          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "14px", background: activeTab === tab.id ? "#dc2626" : "transparent", color: activeTab === tab.id ? "white" : theme.textSub, transition: "all 0.2s", textAlign: "left", width: "100%", marginBottom: "4px" }}>
              {tab.icon} {tab.label}
            </button>
          ))}

          {/* Quick Stats */}
          {stats && (
            <div style={{ marginTop: "20px", padding: "14px", background: theme.bgInput, borderRadius: "12px" }}>
              <p style={{ color: theme.textSub, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", margin: "0 0 10px" }}>Quick Stats</p>
              {[
                { label: "Movies",  value: stats.totalMovies,  color: "#3b82f6" },
                { label: "Users",   value: stats.totalUsers,   color: "#22c55e" },
                { label: "Premium", value: stats.premiumUsers, color: "#eab308" },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ color: theme.textSub, fontSize: "12px" }}>{s.label}</span>
                  <span style={{ color: s.color, fontWeight: 800, fontSize: "14px" }}>{s.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Main Content ── */}
        <div style={{ flex: 1, padding: "32px", overflowX: "auto", maxWidth: "calc(100vw - 240px)" }}>

          {loading ? (
            <div style={{ textAlign: "center", paddingTop: "80px" }}>
              <p style={{ color: theme.textSub, fontSize: "18px" }}>⏳ Loading...</p>
            </div>
          ) : (
            <>

              {/* ══════════════════════ */}
              {/* DASHBOARD TAB         */}
              {/* ══════════════════════ */}
              {activeTab === "dashboard" && (
                <div>
                  <div style={{ marginBottom: "28px" }}>
                    <h1 style={{ fontSize: "26px", fontWeight: 900, margin: "0 0 4px" }}>👋 Welcome, {user.name}!</h1>
                    <p style={{ color: theme.textSub, margin: 0 }}>Here's your CineStream platform overview.</p>
                  </div>

                  {/* Stats */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "28px" }}>
                    {[
                      { label: "Total Movies",   value: stats?.totalMovies   || 0, emoji: "🎬", color: "#3b82f6", bg: "#3b82f622" },
                      { label: "Total Users",    value: stats?.totalUsers    || 0, emoji: "👥", color: "#22c55e", bg: "#22c55e22" },
                      { label: "Premium Movies", value: stats?.premiumMovies || 0, emoji: "💎", color: "#eab308", bg: "#eab30822" },
                      { label: "Premium Users",  value: stats?.premiumUsers  || 0, emoji: "👑", color: "#a855f7", bg: "#a855f722" },
                      { label: "Total Revenue",  value: "৳" + totalRevenue.toLocaleString(), emoji: "💰", color: "#22c55e", bg: "#22c55e22" },
                    ].map(stat => (
                      <div key={stat.label} style={{ ...cardStyle, display: "flex", alignItems: "center", gap: "12px", transition: "box-shadow 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)"}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                      >
                        <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>{stat.emoji}</div>
                        <div>
                          <p style={{ color: theme.textSub, fontSize: "11px", margin: "0 0 2px", fontWeight: 600 }}>{stat.label}</p>
                          <p style={{ color: stat.color, fontSize: "22px", fontWeight: 900, margin: 0 }}>{stat.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Revenue chart mini */}
                  <div style={{ ...cardStyle, marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <h3 style={{ color: theme.textMain, fontWeight: 800, fontSize: "15px", margin: 0 }}>📈 Revenue Overview (Last 6 Months)</h3>
                      <button onClick={() => setActiveTab("revenue")} style={{ background: "transparent", border: "none", color: "#dc2626", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>View Details →</button>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={revenueChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                        <XAxis dataKey="month" stroke={theme.textSub} fontSize={12} />
                        <YAxis stroke={theme.textSub} fontSize={12} />
                        <Tooltip {...tooltipStyle} formatter={v => ["৳" + v, "Revenue"]} />
                        <Line type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={3} dot={{ fill: "#dc2626", r: 4 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>

                    {/* Top Rated */}
                    {topMovie && (
                      <div style={cardStyle}>
                        <h3 style={{ color: theme.textMain, fontWeight: 800, fontSize: "15px", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px" }}>
                          <FaStar style={{ color: "#facc15" }} /> Top Rated Movie
                        </h3>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <img src={topMovie.image} alt={topMovie.title} onError={e => { e.target.src = "https://placehold.co/60x80/1a1a2e/ffffff?text=M"; }} style={{ width: "60px", height: "80px", objectFit: "cover", borderRadius: "10px" }} />
                          <div>
                            <p style={{ color: theme.textMain, fontWeight: 800, fontSize: "16px", margin: "0 0 4px" }}>{topMovie.title}</p>
                            <p style={{ color: theme.textSub, fontSize: "13px", margin: "0 0 8px" }}>{topMovie.genre} • {topMovie.year}</p>
                            <p style={{ color: "#facc15", fontWeight: 700, fontSize: "16px", margin: 0 }}>⭐ {topMovie.rating} / 5.0</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Most Watched */}
                    <div style={cardStyle}>
                      <h3 style={{ color: theme.textMain, fontWeight: 800, fontSize: "15px", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <FaFire style={{ color: "#ef4444" }} /> Most Watched (30 days)
                      </h3>
                      {mostWatched.length === 0 ? (
                        <p style={{ color: theme.textSub, fontSize: "13px" }}>No watch data yet</p>
                      ) : (
                        mostWatched.slice(0, 3).map((movie, index) => (
                          <div key={movie._id} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                            <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: index === 0 ? "#eab308" : index === 1 ? "#9ca3af" : "#b45309", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 900, flexShrink: 0 }}>{index + 1}</div>
                            <img src={movie.image} onError={e => { e.target.src = "https://placehold.co/32x44/1a1a2e/ffffff?text=M"; }} style={{ width: "32px", height: "44px", objectFit: "cover", borderRadius: "6px" }} />
                            <div style={{ flex: 1 }}>
                              <p style={{ color: theme.textMain, fontWeight: 700, fontSize: "13px", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{movie.title}</p>
                              <p style={{ color: theme.textSub, fontSize: "11px", margin: 0 }}>{movie.watchCount} views</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    {/* Recent Movies */}
                    <div style={cardStyle}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                        <h3 style={{ color: theme.textMain, fontWeight: 800, fontSize: "15px", margin: 0 }}>🎬 Recent Movies</h3>
                        <button onClick={() => setActiveTab("movies")} style={{ background: "transparent", border: "none", color: "#dc2626", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>View All →</button>
                      </div>
                      {recentMovies.slice(0, 5).map((movie, index) => (
                        <div key={movie._id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: index < recentMovies.length - 1 ? "1px solid " + theme.border : "none" }}>
                          <img src={movie.image} onError={e => { e.target.src = "https://placehold.co/32x44/1a1a2e/ffffff?text=M"; }} style={{ width: "32px", height: "44px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ color: theme.textMain, fontWeight: 700, fontSize: "13px", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{movie.title}</p>
                            <p style={{ color: theme.textSub, fontSize: "11px", margin: 0 }}>{movie.genre} • {movie.year}</p>
                          </div>
                          <span style={{ color: "#facc15", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>⭐ {movie.rating}</span>
                        </div>
                      ))}
                    </div>

                    {/* Recent Users */}
                    <div style={cardStyle}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                        <h3 style={{ color: theme.textMain, fontWeight: 800, fontSize: "15px", margin: 0 }}>👥 Recent Users</h3>
                        <button onClick={() => setActiveTab("users")} style={{ background: "transparent", border: "none", color: "#dc2626", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>View All →</button>
                      </div>
                      {users.slice(0, 5).map((u, index) => (
                        <div key={u._id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: index < 4 ? "1px solid " + theme.border : "none" }}>
                          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: u.isAdmin ? "#dc2626" : "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: "13px", flexShrink: 0 }}>
                            {u.name.charAt(0)}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ color: theme.textMain, fontWeight: 700, fontSize: "13px", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.name}</p>
                            <p style={{ color: theme.textSub, fontSize: "11px", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.email}</p>
                          </div>
                          {u.isPremium ? (
                            <span style={{ background: "#eab30822", color: "#eab308", fontSize: "10px", padding: "2px 8px", borderRadius: "999px", fontWeight: 700, flexShrink: 0 }}>💎</span>
                          ) : (
                            <span style={{ background: theme.bgInput, color: theme.textSub, fontSize: "10px", padding: "2px 8px", borderRadius: "999px", flexShrink: 0 }}>Free</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════ */}
              {/* REVENUE TAB           */}
              {/* ══════════════════════ */}
              {activeTab === "revenue" && (
                <div>
                  <div style={{ marginBottom: "28px" }}>
                    <h1 style={{ fontSize: "26px", fontWeight: 900, margin: "0 0 4px" }}>💰 Revenue Dashboard</h1>
                    <p style={{ color: theme.textSub, margin: 0 }}>Track your platform earnings and subscriptions.</p>
                  </div>

                  {/* Revenue Stats */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "28px" }}>
                    {[
                      { label: "Total Revenue",    value: "৳" + totalRevenue.toLocaleString(),  emoji: "💰", color: "#22c55e", bg: "#22c55e22" },
                      { label: "Monthly Revenue",  value: "৳" + monthlyRevenue.toLocaleString(), emoji: "📅", color: "#3b82f6", bg: "#3b82f622" },
                      { label: "Yearly Revenue",   value: "৳" + yearlyRevenue.toLocaleString(),  emoji: "📆", color: "#a855f7", bg: "#a855f722" },
                      { label: "Premium Users",    value: stats?.premiumUsers || 0,              emoji: "👑", color: "#eab308", bg: "#eab30822" },
                      { label: "Avg per User",     value: "৳" + (stats?.premiumUsers ? Math.floor(totalRevenue / stats.premiumUsers) : 0), emoji: "📊", color: "#f97316", bg: "#f9731622" },
                    ].map(stat => (
                      <div key={stat.label} style={{ ...cardStyle, transition: "box-shadow 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)"}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>{stat.emoji}</div>
                          <div>
                            <p style={{ color: theme.textSub, fontSize: "11px", margin: "0 0 2px", fontWeight: 600 }}>{stat.label}</p>
                            <p style={{ color: stat.color, fontSize: "20px", fontWeight: 900, margin: 0 }}>{stat.value}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Revenue Bar Chart */}
                  <div style={{ ...cardStyle, marginBottom: "20px" }}>
                    <h3 style={{ color: theme.textMain, fontWeight: 800, fontSize: "15px", margin: "0 0 20px" }}>📊 Monthly Revenue (Last 6 Months)</h3>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={revenueChartData} barSize={40}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.border} vertical={false} />
                        <XAxis dataKey="month" stroke={theme.textSub} fontSize={12} />
                        <YAxis stroke={theme.textSub} fontSize={12} tickFormatter={v => "৳" + v} />
                        <Tooltip {...tooltipStyle} formatter={v => ["৳" + v, "Revenue"]} />
                        <Bar dataKey="revenue" fill="#dc2626" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>

                    {/* Users Line Chart */}
                    <div style={cardStyle}>
                      <h3 style={{ color: theme.textMain, fontWeight: 800, fontSize: "15px", margin: "0 0 20px" }}>👥 New Users Per Month</h3>
                      <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={revenueChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
                          <XAxis dataKey="month" stroke={theme.textSub} fontSize={11} />
                          <YAxis stroke={theme.textSub} fontSize={11} />
                          <Tooltip {...tooltipStyle} />
                          <Legend />
                          <Line type="monotone" dataKey="users" name="Total Users" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                          <Line type="monotone" dataKey="premium" name="Premium" stroke="#eab308" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Plan Distribution Pie */}
                    <div style={cardStyle}>
                      <h3 style={{ color: theme.textMain, fontWeight: 800, fontSize: "15px", margin: "0 0 20px" }}>💎 Subscription Distribution</h3>
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie data={planData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                            {planData.map((entry, index) => (
                              <Cell key={index} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip {...tooltipStyle} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "8px" }}>
                        {planData.map(d => (
                          <div key={d.name} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: d.color }} />
                            <span style={{ color: theme.textSub, fontSize: "12px" }}>{d.name}: {d.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Revenue by Plan Table */}
                  <div style={cardStyle}>
                    <h3 style={{ color: theme.textMain, fontWeight: 800, fontSize: "15px", margin: "0 0 20px" }}>📋 Revenue Breakdown</h3>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: theme.bgInput }}>
                          {["Plan", "Users", "Price", "Revenue", "Share"].map(h => (
                            <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: theme.textSub, fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { plan: "Monthly Premium", users: Math.floor((stats?.premiumUsers || 0) * 0.7), price: "৳199/month", revenue: Math.floor((stats?.premiumUsers || 0) * 0.7) * 199, color: "#3b82f6" },
                          { plan: "Yearly Premium",  users: Math.floor((stats?.premiumUsers || 0) * 0.3), price: "৳1499/year", revenue: Math.floor((stats?.premiumUsers || 0) * 0.3) * 1499, color: "#a855f7" },
                          { plan: "Free",            users: (stats?.totalUsers || 0) - (stats?.premiumUsers || 0), price: "৳0", revenue: 0, color: "#6b7280" },
                        ].map((row, index) => (
                          <tr key={row.plan} style={{ borderTop: "1px solid " + theme.border }}>
                            <td style={{ padding: "14px 16px" }}>
                              <span style={{ color: row.color, fontWeight: 700, fontSize: "14px" }}>{row.plan}</span>
                            </td>
                            <td style={{ padding: "14px 16px", color: theme.textMain, fontWeight: 700 }}>{row.users}</td>
                            <td style={{ padding: "14px 16px", color: theme.textSub }}>{row.price}</td>
                            <td style={{ padding: "14px 16px", color: "#22c55e", fontWeight: 800 }}>৳{row.revenue.toLocaleString()}</td>
                            <td style={{ padding: "14px 16px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div style={{ flex: 1, background: theme.bgInput, borderRadius: "999px", height: "6px", overflow: "hidden" }}>
                                  <div style={{ background: row.color, height: "100%", width: totalRevenue > 0 ? `${(row.revenue / totalRevenue) * 100}%` : "0%", borderRadius: "999px" }} />
                                </div>
                                <span style={{ color: theme.textSub, fontSize: "12px", flexShrink: 0 }}>
                                  {totalRevenue > 0 ? `${Math.round((row.revenue / totalRevenue) * 100)}%` : "0%"}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ══════════════════════ */}
              {/* ANALYTICS TAB         */}
              {/* ══════════════════════ */}
              {activeTab === "analytics" && (
                <div>
                  <div style={{ marginBottom: "28px" }}>
                    <h1 style={{ fontSize: "26px", fontWeight: 900, margin: "0 0 4px" }}>🔥 Analytics</h1>
                    <p style={{ color: theme.textSub, margin: 0 }}>Platform performance and content analytics.</p>
                  </div>

                  {/* Platform Stats */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px", marginBottom: "28px" }}>
                    {[
                      { label: "Total Movies",   value: stats?.totalMovies   || 0, emoji: "🎬", color: "#3b82f6" },
                      { label: "Total Users",    value: stats?.totalUsers    || 0, emoji: "👥", color: "#22c55e" },
                      { label: "Premium Users",  value: stats?.premiumUsers  || 0, emoji: "💎", color: "#eab308" },
                      { label: "Free Users",     value: (stats?.totalUsers || 0) - (stats?.premiumUsers || 0), emoji: "🆓", color: "#6b7280" },
                      { label: "Premium Movies", value: stats?.premiumMovies || 0, emoji: "👑", color: "#a855f7" },
                      { label: "Free Movies",    value: (stats?.totalMovies || 0) - (stats?.premiumMovies || 0), emoji: "🎥", color: "#22c55e" },
                    ].map(stat => (
                      <div key={stat.label} style={{ ...cardStyle, textAlign: "center" }}>
                        <div style={{ fontSize: "28px", marginBottom: "8px" }}>{stat.emoji}</div>
                        <p style={{ color: stat.color, fontSize: "24px", fontWeight: 900, margin: "0 0 4px" }}>{stat.value}</p>
                        <p style={{ color: theme.textSub, fontSize: "11px", fontWeight: 600, margin: 0, textTransform: "uppercase" }}>{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>

                    {/* Genre Pie Chart */}
                    <div style={cardStyle}>
                      <h3 style={{ color: theme.textMain, fontWeight: 800, fontSize: "15px", margin: "0 0 20px" }}>🎭 Movies by Genre</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie data={genreData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={true}>
                            {genreData.map((_, index) => (
                              <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip {...tooltipStyle} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Genre Bar Chart */}
                    <div style={cardStyle}>
                      <h3 style={{ color: theme.textMain, fontWeight: 800, fontSize: "15px", margin: "0 0 20px" }}>📊 Genre Distribution</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={genreData} layout="vertical" barSize={18}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme.border} horizontal={false} />
                          <XAxis type="number" stroke={theme.textSub} fontSize={11} />
                          <YAxis type="category" dataKey="name" stroke={theme.textSub} fontSize={11} width={70} />
                          <Tooltip {...tooltipStyle} />
                          <Bar dataKey="value" name="Movies" radius={[0, 6, 6, 0]}>
                            {genreData.map((_, index) => (
                              <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Most Watched Full List */}
                  <div style={cardStyle}>
                    <h3 style={{ color: theme.textMain, fontWeight: 800, fontSize: "16px", margin: "0 0 20px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <FaFire style={{ color: "#ef4444" }} /> Most Watched (Last 30 Days)
                    </h3>
                    {mostWatched.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "40px" }}>
                        <p style={{ fontSize: "40px", margin: "0 0 12px" }}>📊</p>
                        <p style={{ color: theme.textMain, fontWeight: 700, margin: "0 0 8px" }}>No watch data yet</p>
                        <p style={{ color: theme.textSub, fontSize: "13px", margin: 0 }}>Users need to watch movies to see analytics</p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {mostWatched.map((movie, index) => (
                          <div key={movie._id} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px", background: theme.bgInput, borderRadius: "12px" }}>
                            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: index === 0 ? "#eab308" : index === 1 ? "#9ca3af" : index === 2 ? "#b45309" : theme.border, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "13px", flexShrink: 0 }}>{index + 1}</div>
                            <img src={movie.image} onError={e => { e.target.src = "https://placehold.co/40x56/1a1a2e/ffffff?text=M"; }} style={{ width: "40px", height: "56px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                              <p style={{ color: theme.textMain, fontWeight: 700, fontSize: "14px", margin: "0 0 4px" }}>{movie.title}</p>
                              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                <span style={{ background: "#dc262622", color: "#dc2626", fontSize: "11px", padding: "2px 8px", borderRadius: "999px", fontWeight: 600 }}>{movie.genre}</span>
                                <span style={{ color: "#facc15", fontSize: "12px", fontWeight: 700 }}>⭐ {movie.rating}</span>
                              </div>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0, marginRight: "12px" }}>
                              <p style={{ color: "#ef4444", fontWeight: 900, fontSize: "18px", margin: "0 0 2px" }}>{movie.watchCount}</p>
                              <p style={{ color: theme.textSub, fontSize: "11px", margin: 0 }}>views</p>
                            </div>
                            <div style={{ width: "100px", flexShrink: 0 }}>
                              <div style={{ background: theme.border, borderRadius: "999px", height: "6px", overflow: "hidden" }}>
                                <div style={{ background: "#ef4444", borderRadius: "999px", height: "100%", width: `${Math.min((movie.watchCount / (mostWatched[0]?.watchCount || 1)) * 100, 100)}%` }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ══════════════════════ */}
              {/* MOVIES TAB            */}
              {/* ══════════════════════ */}
              {activeTab === "movies" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <h1 style={{ fontSize: "24px", fontWeight: 900, margin: "0 0 4px" }}>🎬 Manage Movies</h1>
                      <p style={{ color: theme.textSub, margin: 0, fontSize: "14px" }}>{movies.length} movies total</p>
                    </div>
                    <button onClick={() => { setShowForm(true); setEditingMovie(null); setMovieForm({ title: "", genre: "", year: "", duration: "", rating: "", isPremium: false, description: "", image: "", banner: "", trailer: "", videoUrl: "", downloadUrl: "", mood: "" }); }} style={{ background: "#dc2626", color: "white", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: 700, fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                      <FaPlus /> Add Movie
                    </button>
                  </div>

                  {/* Form */}
                  {showForm && (
                    <div style={{ ...cardStyle, marginBottom: "24px" }}>
                      <h3 style={{ color: theme.textMain, fontWeight: 800, fontSize: "16px", margin: "0 0 20px" }}>
                        {editingMovie ? "✏️ Edit Movie" : "➕ Add New Movie"}
                      </h3>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "14px" }}>
                        {[
                          { label: "Title *",       key: "title",       placeholder: "Movie title" },
                          { label: "Genre *",       key: "genre",       placeholder: "Action, Comedy..." },
                          { label: "Year",          key: "year",        placeholder: "2024" },
                          { label: "Duration",      key: "duration",    placeholder: "2h 30m" },
                          { label: "Rating",        key: "rating",      placeholder: "4.5" },
                          { label: "Image URL",     key: "image",       placeholder: "https://..." },
                          { label: "Banner URL",    key: "banner",      placeholder: "https://..." },
                          { label: "Trailer URL",   key: "trailer",     placeholder: "https://youtube.com/embed/..." },
                          { label: "Video URL",     key: "videoUrl",    placeholder: "https://youtube.com/embed/..." },
                          { label: "Download URL",  key: "downloadUrl", placeholder: "https://drive.google.com/..." },
                          { label: "Mood (comma)",  key: "mood",        placeholder: "happy, excited, romantic" },
                        ].map(field => (
                          <div key={field.key}>
                            <label style={{ color: theme.textSub, fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }}>{field.label}</label>
                            <input type="text" placeholder={field.placeholder} value={movieForm[field.key]} onChange={e => setMovieForm({ ...movieForm, [field.key]: e.target.value })} style={inputStyle} />
                          </div>
                        ))}
                      </div>
                      <div style={{ marginBottom: "14px" }}>
                        <label style={{ color: theme.textSub, fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }}>Description</label>
                        <textarea placeholder="Movie description..." value={movieForm.description} onChange={e => setMovieForm({ ...movieForm, description: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                        <input type="checkbox" id="isPremium" checked={movieForm.isPremium} onChange={e => setMovieForm({ ...movieForm, isPremium: e.target.checked })} style={{ width: "16px", height: "16px", cursor: "pointer" }} />
                        <label htmlFor="isPremium" style={{ color: theme.textMain, fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>💎 Premium Movie</label>
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={handleSaveMovie} style={{ background: "#dc2626", color: "white", border: "none", padding: "10px 24px", borderRadius: "10px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>
                          {editingMovie ? "✓ Save Changes" : "✓ Add Movie"}
                        </button>
                        <button onClick={() => { setShowForm(false); setEditingMovie(null); }} style={{ background: theme.bgInput, color: theme.textMain, border: "1px solid " + theme.border, padding: "10px 24px", borderRadius: "10px", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Search */}
                  <div style={{ position: "relative", marginBottom: "16px", maxWidth: "320px" }}>
                    <FaSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: theme.textSub, fontSize: "13px" }} />
                    <input type="text" placeholder="Search movies..." value={movieSearch} onChange={e => setMovieSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: "34px" }} />
                  </div>

                  {/* Table */}
                  <div style={{ ...cardStyle, padding: 0, overflow: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
                      <thead>
                        <tr style={{ background: theme.bgInput, borderBottom: "1px solid " + theme.border }}>
                          {["Poster", "Title", "Genre", "Year", "Rating", "Type", "Video", "Actions"].map(h => (
                            <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: theme.textSub, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMovies.map((movie, index) => (
                          <tr key={movie._id} style={{ borderTop: index > 0 ? "1px solid " + theme.border : "none", transition: "background 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.background = theme.bgInput + "80"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                          >
                            <td style={{ padding: "10px 16px" }}>
                              <img src={movie.image} onError={e => { e.target.src = "https://placehold.co/36x50/1a1a2e/ffffff?text=M"; }} style={{ width: "36px", height: "50px", objectFit: "cover", borderRadius: "6px" }} />
                            </td>
                            <td style={{ padding: "10px 16px", color: theme.textMain, fontWeight: 700, fontSize: "14px", maxWidth: "160px" }}>
                              <p style={{ margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{movie.title}</p>
                            </td>
                            <td style={{ padding: "10px 16px" }}>
                              <span style={{ background: "#dc262622", color: "#dc2626", fontSize: "11px", padding: "3px 10px", borderRadius: "999px", fontWeight: 600, whiteSpace: "nowrap" }}>{movie.genre}</span>
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
                              {movie.videoUrl ? (
                                <span style={{ color: "#22c55e", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}><FaCheckCircle /> Yes</span>
                              ) : (
                                <span style={{ color: "#ef4444", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}><FaTimesCircle /> No</span>
                              )}
                            </td>
                            <td style={{ padding: "10px 16px" }}>
                              <div style={{ display: "flex", gap: "6px" }}>
                                <button onClick={() => handleEditMovie(movie)} style={{ background: "#3b82f622", color: "#3b82f6", border: "1px solid #3b82f644", padding: "5px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                                  <FaEdit /> Edit
                                </button>
                                <button onClick={() => handleDeleteMovie(movie._id)} style={{ background: "#ef444422", color: "#ef4444", border: "1px solid #ef444444", padding: "5px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                                  <FaTrash /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredMovies.length === 0 && (
                      <div style={{ textAlign: "center", padding: "40px", color: theme.textSub }}>No movies found</div>
                    )}
                  </div>
                </div>
              )}

              {/* ══════════════════════ */}
              {/* USERS TAB             */}
              {/* ══════════════════════ */}
              {activeTab === "users" && (
                <div>
                  <div style={{ marginBottom: "24px" }}>
                    <h1 style={{ fontSize: "24px", fontWeight: 900, margin: "0 0 4px" }}>👥 Manage Users</h1>
                    <p style={{ color: theme.textSub, margin: 0, fontSize: "14px" }}>{users.length} total • {users.filter(u => u.isPremium).length} premium • {users.filter(u => !u.isPremium).length} free</p>
                  </div>

                  {/* Search */}
                  <div style={{ position: "relative", marginBottom: "16px", maxWidth: "320px" }}>
                    <FaSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: theme.textSub, fontSize: "13px" }} />
                    <input type="text" placeholder="Search users..." value={userSearch} onChange={e => setUserSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: "34px" }} />
                  </div>

                  <div style={{ ...cardStyle, padding: 0, overflow: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                      <thead>
                        <tr style={{ background: theme.bgInput, borderBottom: "1px solid " + theme.border }}>
                          {["#", "User", "Email", "Plan", "Role", "Joined", "Actions"].map(h => (
                            <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: theme.textSub, fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u, index) => (
                          <tr key={u._id} style={{ borderTop: index > 0 ? "1px solid " + theme.border : "none", transition: "background 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.background = theme.bgInput + "80"}
                            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                          >
                            <td style={{ padding: "14px 16px", color: theme.textSub, fontSize: "14px" }}>{index + 1}</td>
                            <td style={{ padding: "14px 16px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: u.isAdmin ? "#dc2626" : u.isPremium ? "#eab308" : "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: "14px", flexShrink: 0 }}>
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
                                <span style={{ color: theme.textSub, fontSize: "13px" }}>👤 User</span>
                              )}
                            </td>
                            <td style={{ padding: "14px 16px", color: theme.textSub, fontSize: "13px", whiteSpace: "nowrap" }}>
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td style={{ padding: "14px 16px" }}>
                              {!u.isAdmin && (
                                <button onClick={() => handleDeleteUser(u._id, u.name)} style={{ background: "#ef444422", color: "#ef4444", border: "1px solid #ef444444", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                                  <FaTrash /> Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                      <div style={{ textAlign: "center", padding: "40px", color: theme.textSub }}>No users found</div>
                    )}
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