const axios = require("axios");

const BASE_URL = "https://cinestream-backend-ng16.onrender.com";

const fixedPosters = [
  { title: "Pride and Prejudice", image: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/5k4yppzN8NkDt01TfGDpgkVDdOo.jpg" },
  { title: "The Matrix", image: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg" },
  { title: "Get Out", image: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/tFXcEccSUFedh6WmSPvKaR410vx.jpg" },
  { title: "Superbad", image: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/ek8e8txUyUwd2BNqj6lFEerJfbq.jpg" },
  { title: "The Shawshank Redemption", image: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg" },
  { title: "Mission Impossible", image: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/3OnaECDmSPDQNP8n1fDMTEyNhZr.jpg" },
  { title: "The Mask", image: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/pubpHOh8pHGRzOJVFE8JxOBKNBR.jpg" },
  { title: "Avengers", image: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/RYMX2wcKCBAr24UyPD7KE5FNJbV.jpg" },
];

const newMovie = {
  title: "Good Will Hunting",
  description: "Will Hunting, a janitor at MIT, has a gift for mathematics but needs help from a psychologist to find direction in his life.",
  genre: "Drama",
  year: 1997,
  duration: "2h 6m",
  rating: 4.8,
  isPremium: false,
  image: "https://m.media-amazon.com/images/M/MV5BOTI0MzcxMTYtZDVkMy00NjY1LTgyMTYtZmUxN2M3NmQ2NWJhXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
  banner: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1920",
  trailer: "https://www.youtube.com/embed/PtBOFTMJpwE",
  videoUrl: "https://www.youtube.com/embed/PtBOFTMJpwE",
  mood: ["thoughtful", "sad"],
  trailerPreview: "",
};

async function run() {
  try {
    console.log("🔐 Logging in as admin...");
    const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: "admin@cinestream.com",
      password: "admin123",
    });
    const token = loginRes.data.token;
    console.log("✅ Login successful!\n");

    const moviesRes = await axios.get(`${BASE_URL}/api/movies`);
    const allMovies = moviesRes.data.movies;

    // Step 1 — Fix broken posters
    console.log("🖼️  Fixing broken posters...");
    for (const fix of fixedPosters) {
      const movie = allMovies.find((m) => m.title.toLowerCase() === fix.title.toLowerCase());
      if (!movie) { console.log(`⚠️  Not found: ${fix.title}`); continue; }
      try {
        await axios.put(`${BASE_URL}/api/movies/${movie._id}`, { image: fix.image }, { headers: { Authorization: `Bearer ${token}` } });
        console.log(`✅ Fixed: ${fix.title}`);
      } catch (err) {
        console.log(`❌ Failed: ${fix.title} — ${err.response?.data?.message || err.message}`);
      }
    }

    // Step 2 — Delete The Notebook
    console.log("\n🗑️  Removing The Notebook...");
    const notebook = allMovies.find((m) => m.title.toLowerCase() === "the notebook");
    if (notebook) {
      try {
        await axios.delete(`${BASE_URL}/api/movies/${notebook._id}`, { headers: { Authorization: `Bearer ${token}` } });
        console.log("✅ The Notebook removed!");
      } catch (err) {
        console.log(`❌ Failed to remove: ${err.response?.data?.message || err.message}`);
      }
    } else {
      console.log("⚠️  The Notebook not found!");
    }

    // Step 3 — Add Good Will Hunting
    console.log("\n🎬 Adding Good Will Hunting...");
    const exists = allMovies.find((m) => m.title.toLowerCase() === "good will hunting");
    if (exists) {
      console.log("⏭️  Good Will Hunting already exists!");
    } else {
      try {
        await axios.post(`${BASE_URL}/api/movies`, newMovie, { headers: { Authorization: `Bearer ${token}` } });
        console.log("✅ Good Will Hunting added!");
      } catch (err) {
        console.log(`❌ Failed: ${err.response?.data?.message || err.message}`);
      }
    }

    console.log("\n🎉 All done!");
  } catch (err) {
    console.error("❌ Login failed:", err.response?.data || err.message);
  }
}

run();