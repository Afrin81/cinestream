const axios = require("axios");

const BASE_URL = "https://cinestream-backend-ng16.onrender.com";

const fixedPosters = [
  { title: "Pride and Prejudice", image: "https://image.tmdb.org/t/p/w500/5k4yppzN8NkDt01TfGDpgkVDdOo.jpg" },
  { title: "Get Out", image: "https://image.tmdb.org/t/p/w500/tFXcEccSUFedh6WmSPvKaR410vx.jpg" },
  { title: "Mission Impossible", image: "https://image.tmdb.org/t/p/w500/3OnaECDmSPDQNP8n1fDMTEyNhZr.jpg" },
  { title: "The Mask", image: "https://image.tmdb.org/t/p/w500/pubpHOh8pHGRzOJVFE8JxOBKNBR.jpg" },
  { title: "Avengers", image: "https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7KE5FNJbV.jpg" },
];

async function run() {
  try {
    console.log("🔐 Logging in...");
    const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: "admin@cinestream.com",
      password: "admin123",
    });
    const token = loginRes.data.token;
    console.log("✅ Login successful!\n");

    const moviesRes = await axios.get(`${BASE_URL}/api/movies`);
    const allMovies = moviesRes.data.movies;

    for (const fix of fixedPosters) {
      const movie = allMovies.find((m) => m.title.toLowerCase() === fix.title.toLowerCase());
      if (!movie) { console.log(`⚠️ Not found: ${fix.title}`); continue; }
      try {
        await axios.put(`${BASE_URL}/api/movies/${movie._id}`, { image: fix.image }, { headers: { Authorization: `Bearer ${token}` } });
        console.log(`✅ Fixed: ${fix.title}`);
      } catch (err) {
        console.log(`❌ Failed: ${fix.title} — ${err.response?.data?.message || err.message}`);
      }
    }
    console.log("\n🎉 Done!");
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
  }
}

run();