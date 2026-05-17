const axios = require("axios");

const BASE_URL = "https://cinestream-backend-ng16.onrender.com";

const movieUpdates = [
  { title: "Good Will Hunting", trailer: "https://www.youtube.com/embed/PtBOFTMJpwE", videoUrl: "https://www.youtube.com/embed/P-8KPjajRFo" },
  { title: "Parasite", trailer: "https://www.youtube.com/embed/5xH0HfJHsaY", videoUrl: "https://www.youtube.com/embed/han7DfFTSqs" },
  { title: "Gone Girl", trailer: "https://www.youtube.com/embed/4Cs5oNhKOsQ", videoUrl: "https://www.youtube.com/embed/4Cs5oNhKOsQ" },
  { title: "Pride and Prejudice", trailer: "https://www.youtube.com/embed/1dqte7CeRkI", videoUrl: "https://www.youtube.com/embed/P9-FMiEJSLQ" },
  { title: "La La Land", trailer: "https://www.youtube.com/embed/0pdqf4P9MB8", videoUrl: "https://www.youtube.com/embed/1GJPFnGBMvs" },
  { title: "Dune", trailer: "https://www.youtube.com/embed/8g18jFHCLXk", videoUrl: "https://www.youtube.com/embed/Go9BStkBR4o" },
  { title: "Gravity", trailer: "https://www.youtube.com/embed/OiTiKOy59o4", videoUrl: "https://www.youtube.com/embed/3Pi7T5KTpxA" },
  { title: "The Matrix", trailer: "https://www.youtube.com/embed/vKQi3bBA1y8", videoUrl: "https://www.youtube.com/embed/m8e-FF8MsqU" },
  { title: "It", trailer: "https://www.youtube.com/embed/FnCdOQsX5kc", videoUrl: "https://www.youtube.com/embed/xKJmEC5ieOk" },
  { title: "A Quiet Place", trailer: "https://www.youtube.com/embed/WR7cc5t7tv8", videoUrl: "https://www.youtube.com/embed/WR7cc5t7tv8" },
  { title: "Get Out", trailer: "https://www.youtube.com/embed/DzfpyUB60YY", videoUrl: "https://www.youtube.com/embed/DzfpyUB60YY" },
  { title: "Superbad", trailer: "https://www.youtube.com/embed/4eaZ_48ZYog", videoUrl: "https://www.youtube.com/embed/4eaZ_48ZYog" },
  { title: "The Hangover", trailer: "https://www.youtube.com/embed/tcdUhdOlz9M", videoUrl: "https://www.youtube.com/embed/tcdUhdOlz9M" },
  { title: "Home Alone", trailer: "https://www.youtube.com/embed/1TPn4G-Xtm8", videoUrl: "https://www.youtube.com/embed/vbSCHkbGJds" },
  { title: "Titanic", trailer: "https://www.youtube.com/embed/kVrqfYjkTdQ", videoUrl: "https://www.youtube.com/embed/CHekZFdFgzQ" },
  { title: "Forrest Gump", trailer: "https://www.youtube.com/embed/bLvqoHBptjg", videoUrl: "https://www.youtube.com/embed/XnA6yBl-HN8" },
  { title: "The Shawshank Redemption", trailer: "https://www.youtube.com/embed/6hB3S9bIaco", videoUrl: "https://www.youtube.com/embed/NmzuHjWmXOc" },
  { title: "Mission Impossible", trailer: "https://www.youtube.com/embed/bTYSgExOAwA", videoUrl: "https://www.youtube.com/embed/bTYSgExOAwA" },
  { title: "John Wick", trailer: "https://www.youtube.com/embed/2AUmvWm5ZDQ", videoUrl: "https://www.youtube.com/embed/Ks_tFGjH2dQ" },
  { title: "Black Panther", trailer: "https://www.youtube.com/embed/xjDjIWPwcPU", videoUrl: "https://www.youtube.com/embed/xjDjIWPwcPU" },
  { title: "Iron Man", trailer: "https://www.youtube.com/embed/8ugaeA-nMTc", videoUrl: "https://www.youtube.com/embed/Blg5OQfJqwg" },
  { title: "Inception", trailer: "https://www.youtube.com/embed/YoHD9XEInc0", videoUrl: "https://www.youtube.com/embed/x9hBWnh_O6A" },
  { title: "The Mask", trailer: "https://www.youtube.com/embed/4O2zr0GqPMI", videoUrl: "https://www.youtube.com/embed/4O2zr0GqPMI" },
  { title: "The Conjuring", trailer: "https://www.youtube.com/embed/k10ETZ41q5o", videoUrl: "https://www.youtube.com/embed/k10ETZ41q5o" },
  { title: "Interstellar", trailer: "https://www.youtube.com/embed/zSWdZVtXT7E", videoUrl: "https://www.youtube.com/embed/0vxOhd4qlnA" },
  { title: "Spider-Man No Way Home", trailer: "https://www.youtube.com/embed/JfVOs4VSpmA", videoUrl: "https://www.youtube.com/embed/JfVOs4VSpmA" },
  { title: "Batman", trailer: "https://www.youtube.com/embed/EXeTwQWrcwY", videoUrl: "https://www.youtube.com/embed/EXeTwQWrcwY" },
  { title: "Avengers", trailer: "https://www.youtube.com/embed/eOrNdBpGMv8", videoUrl: "https://www.youtube.com/embed/eOrNdBpGMv8" },
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

    console.log("🎬 Updating trailer and videoUrl...");
    let updated = 0;

    for (const update of movieUpdates) {
      const movie = allMovies.find((m) => m.title.toLowerCase() === update.title.toLowerCase());
      if (!movie) { console.log(`⚠️ Not found: ${update.title}`); continue; }
      try {
        await axios.put(
          `${BASE_URL}/api/movies/${movie._id}`,
          { trailer: update.trailer, videoUrl: update.videoUrl },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(`✅ Updated: ${update.title}`);
        updated++;
      } catch (err) {
        console.log(`❌ Failed: ${update.title} — ${err.response?.data?.message || err.message}`);
      }
    }

    console.log(`\n🎉 Done! ${updated} movies updated!`);
  } catch (err) {
    console.error("❌ Login failed:", err.response?.data || err.message);
  }
}

run();