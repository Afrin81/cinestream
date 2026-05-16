const axios = require("axios");

const BASE_URL = "https://cinestream-backend-ng16.onrender.com";

const fixedPosters = [
  {
    title: "Pride and Prejudice",
    image: "https://upload.wikimedia.org/wikipedia/en/b/b4/PrideAndPrejudicePoster.jpg",
  },
  {
    title: "The Matrix",
    image: "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg",
  },
  {
    title: "Get Out",
    image: "https://upload.wikimedia.org/wikipedia/en/a/a3/Get_Out_poster.png",
  },
  {
    title: "Superbad",
    image: "https://upload.wikimedia.org/wikipedia/en/e/ee/Superbad_poster.png",
  },
  {
    title: "The Shawshank Redemption",
    image: "https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg",
  },
  {
    title: "Mission Impossible",
    image: "https://upload.wikimedia.org/wikipedia/en/b/b7/MissionImpossible1996.jpg",
  },
  {
    title: "The Notebook",
    image: "https://upload.wikimedia.org/wikipedia/en/8/81/TheNotebookMoviePoster.jpg",
  },
  {
    title: "The Mask",
    image: "https://upload.wikimedia.org/wikipedia/en/f/f6/The_Mask_film_poster.jpg",
  },
  {
    title: "Avengers",
    image: "https://upload.wikimedia.org/wikipedia/en/8/8a/The_Avengers_%282012_film%29_poster.jpg",
  },
];

async function fixPosters() {
  try {
    console.log("🔐 Logging in as admin...");
    const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: "admin@cinestream.com",
      password: "admin123",
    });

    const token = loginRes.data.token;
    console.log("✅ Login successful!\n");

    // Get all movies
    const moviesRes = await axios.get(`${BASE_URL}/api/movies`);
    const allMovies = moviesRes.data.movies;

    for (const fix of fixedPosters) {
      const movie = allMovies.find(
        (m) => m.title.toLowerCase() === fix.title.toLowerCase()
      );

      if (!movie) {
        console.log(`⚠️  Not found: ${fix.title}`);
        continue;
      }

      try {
        await axios.put(`${BASE_URL}/api/movies/${movie._id}`, 
          { image: fix.image },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(`✅ Fixed poster: ${fix.title}`);
      } catch (err) {
        console.log(`❌ Failed: ${fix.title} — ${err.response?.data?.message || err.message}`);
      }
    }

    console.log("\n🎬 All posters fixed!");
  } catch (err) {
    console.error("❌ Login failed:", err.response?.data || err.message);
  }
}

fixPosters();
