const axios = require("axios");

const BASE_URL = "https://cinestream-backend-ng16.onrender.com";

const fixedPosters = [
  { title: "Pride and Prejudice", image: "https://m.media-amazon.com/images/M/MV5BMTA1NDQ3NTcyOTNeQTJeQWpwZ15BbWU3MDQ5MDE2MzQ@._V1_.jpg" },
  { title: "The Matrix", image: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVlLTM5YTctZjEwM2ZlZjk5OTgxXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg" },
  { title: "Get Out", image: "https://m.media-amazon.com/images/M/MV5BMjUxMDQwNjcyMl5BMl5BanBnXkFtZTgwNzcwMzc1MTI@._V1_.jpg" },
  { title: "Superbad", image: "https://m.media-amazon.com/images/M/MV5BMTc0NjIyMjA2OF5BMl5BanBnXkFtZTcwMDA1NjgyMQ@@._V1_.jpg" },
  { title: "The Shawshank Redemption", image: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NiYyLTg3YzItOTk2OWZlZTljNzIxXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg" },
  { title: "Mission Impossible", image: "https://m.media-amazon.com/images/M/MV5BMTk3NDQ0MjY2OF5BMl5BanBnXkFtZTYwNjA2OTI3._V1_.jpg" },
  { title: "The Notebook", image: "https://m.media-amazon.com/images/M/MV5BMTk3OTM5Njg5M15BMl5BanBnXkFtZTYwMzA0ODI3._V1_.jpg" },
  { title: "The Mask", image: "https://m.media-amazon.com/images/M/MV5BYjYxN2Y4MjEtYThjMS00MDc2LTg0NDAtMDg0YmM4ZWMwNTk4XkEyXkFqcGdeQXVyNjE5MjUyOTM@._V1_.jpg" },
  { title: "Avengers", image: "https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGM2NTg4XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg" },
];

async function fixPosters(token, allMovies) {
  console.log("\n🖼️  Fixing broken posters...");
  for (const fix of fixedPosters) {
    const movie = allMovies.find((m) => m.title.toLowerCase() === fix.title.toLowerCase());
    if (!movie) { console.log(`⚠️  Not found: ${fix.title}`); continue; }
    try {
      await axios.put(`${BASE_URL}/api/movies/${movie._id}`, { image: fix.image }, { headers: { Authorization: `Bearer ${token}` } });
      console.log(`✅ Fixed poster: ${fix.title}`);
    } catch (err) {
      console.log(`❌ Failed: ${fix.title} — ${err.response?.data?.message || err.message}`);
    }
  }
  console.log("✅ All posters fixed!\n");
}

const movies = [
  { title: "Iron Man", description: "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.", genre: "Action", year: 2008, duration: "2h 6m", rating: 4.7, isPremium: false, image: "https://m.media-amazon.com/images/M/MV5BMTczNTI2ODUwOF5BMl5BanBnXkFtZTcwMTU0NTIzMw@@._V1_.jpg", banner: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1920", trailer: "https://www.youtube.com/embed/8ugaeA-nMTc", videoUrl: "https://www.youtube.com/embed/8ugaeA-nMTc", mood: ["excited", "happy"], trailerPreview: "" },
  { title: "Black Panther", description: "T'Challa, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people into a new future.", genre: "Action", year: 2018, duration: "2h 14m", rating: 4.6, isPremium: false, image: "https://m.media-amazon.com/images/M/MV5BMTg1MTY2MjYzNV5BMl5BanBnXkFtZTgwMTc4NTMwNDI@._V1_.jpg", banner: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920", trailer: "https://www.youtube.com/embed/xjDjIWPwcPU", videoUrl: "https://www.youtube.com/embed/xjDjIWPwcPU", mood: ["excited", "thoughtful"], trailerPreview: "" },
  { title: "John Wick", description: "An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took everything from him.", genre: "Action", year: 2014, duration: "1h 41m", rating: 4.6, isPremium: true, image: "https://m.media-amazon.com/images/M/MV5BMTU2NjA1ODgzMF5BMl5BanBnXkFtZTgwMTM2MTI4MjE@._V1_.jpg", banner: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1920", trailer: "https://www.youtube.com/embed/2AUmvWm5ZDQ", videoUrl: "https://www.youtube.com/embed/2AUmvWm5ZDQ", mood: ["excited"], trailerPreview: "" },
  { title: "Mission Impossible", description: "An American agent, under false suspicion of disloyalty, must discover and expose the real spy without the help of his organization.", genre: "Action", year: 1996, duration: "1h 50m", rating: 4.3, isPremium: false, image: "https://m.media-amazon.com/images/M/MV5BMTk3NDQ0MjY2OF5BMl5BanBnXkFtZTYwNjA2OTI3._V1_.jpg", banner: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920", trailer: "https://www.youtube.com/embed/bTYSgExOAwA", videoUrl: "https://www.youtube.com/embed/bTYSgExOAwA", mood: ["excited", "thoughtful"], trailerPreview: "" },
  { title: "The Shawshank Redemption", description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", genre: "Drama", year: 1994, duration: "2h 22m", rating: 5.0, isPremium: true, image: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NiYyLTg3YzItOTk2OWZlZTljNzIxXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg", banner: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1920", trailer: "https://www.youtube.com/embed/6hB3S9bIaco", videoUrl: "https://www.youtube.com/embed/6hB3S9bIaco", mood: ["thoughtful", "sad"], trailerPreview: "" },
  { title: "Forrest Gump", description: "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold through the perspective of an Alabama man.", genre: "Drama", year: 1994, duration: "2h 22m", rating: 4.8, isPremium: false, image: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg", banner: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1920", trailer: "https://www.youtube.com/embed/bLvqoHBptjg", videoUrl: "https://www.youtube.com/embed/bLvqoHBptjg", mood: ["happy", "sad", "thoughtful"], trailerPreview: "" },
  { title: "Titanic", description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.", genre: "Drama", year: 1997, duration: "3h 14m", rating: 4.7, isPremium: true, image: "https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg", banner: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920", trailer: "https://www.youtube.com/embed/kVrqfYjkTdQ", videoUrl: "https://www.youtube.com/embed/kVrqfYjkTdQ", mood: ["romantic", "sad"], trailerPreview: "" },
  { title: "Home Alone", description: "An eight-year-old troublemaker must protect his house from a pair of burglars when he is accidentally left home alone by his family.", genre: "Comedy", year: 1990, duration: "1h 43m", rating: 4.5, isPremium: false, image: "https://m.media-amazon.com/images/M/MV5BMzFkM2YwOTQtYzk2Mi00N2VlLWE3NTItN2YwNDg1YmY0ZDNmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg", banner: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1920", trailer: "https://www.youtube.com/embed/1TPn4G-Xtm8", videoUrl: "https://www.youtube.com/embed/1TPn4G-Xtm8", mood: ["happy", "excited"], trailerPreview: "" },
  { title: "The Hangover", description: "Three buddies wake up from a bachelor party in Las Vegas with no memory of the previous night and the groom is missing.", genre: "Comedy", year: 2009, duration: "1h 40m", rating: 4.3, isPremium: false, image: "https://m.media-amazon.com/images/M/MV5BNGQwZjg5YmYtY2VkNC00NzliLTljYTctNzI5NmU3MjE2ODQzXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg", banner: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1920", trailer: "https://www.youtube.com/embed/tcdUhdOlz9M", videoUrl: "https://www.youtube.com/embed/tcdUhdOlz9M", mood: ["happy", "excited"], trailerPreview: "" },
  { title: "Superbad", description: "Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.", genre: "Comedy", year: 2007, duration: "1h 53m", rating: 4.2, isPremium: false, image: "https://m.media-amazon.com/images/M/MV5BMTc0NjIyMjA2OF5BMl5BanBnXkFtZTcwMDA1NjgyMQ@@._V1_.jpg", banner: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1920", trailer: "https://www.youtube.com/embed/4eaZ_48ZYog", videoUrl: "https://www.youtube.com/embed/4eaZ_48ZYog", mood: ["happy"], trailerPreview: "" },
  { title: "Get Out", description: "A young African-American visits his white girlfriend's parents for the weekend, where his uneasiness grows as disturbing events unfold.", genre: "Horror", year: 2017, duration: "1h 44m", rating: 4.5, isPremium: true, image: "https://m.media-amazon.com/images/M/MV5BMjUxMDQwNjcyMl5BMl5BanBnXkFtZTgwNzcwMzc1MTI@._V1_.jpg", banner: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1920", trailer: "https://www.youtube.com/embed/DzfpyUB60YY", videoUrl: "https://www.youtube.com/embed/DzfpyUB60YY", mood: ["scared", "thoughtful"], trailerPreview: "" },
  { title: "A Quiet Place", description: "In a post-apocalyptic world, a family is forced to live in near silence while hiding from creatures that hunt by sound.", genre: "Horror", year: 2018, duration: "1h 30m", rating: 4.4, isPremium: false, image: "https://m.media-amazon.com/images/M/MV5BMjI0MDMzNTQ0M15BMl5BanBnXkFtZTgwMTM5NzM3NDM@._V1_.jpg", banner: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920", trailer: "https://www.youtube.com/embed/WR7cc5t7tv8", videoUrl: "https://www.youtube.com/embed/WR7cc5t7tv8", mood: ["scared", "excited"], trailerPreview: "" },
  { title: "It", description: "In the summer of 1989, a group of bullied kids band together to destroy a shape-shifting monster which disguises itself as a clown.", genre: "Horror", year: 2017, duration: "2h 15m", rating: 4.3, isPremium: false, image: "https://m.media-amazon.com/images/M/MV5BZDVkZmI0YzAtNzdjYi00ZjhhLWE1ODEtMWMzMWMzNDA0NmQ4XkEyXkFqcGdeQXVyNzYzODM3Mzg@._V1_.jpg", banner: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1920", trailer: "https://www.youtube.com/embed/FnCdOQsX5kc", videoUrl: "https://www.youtube.com/embed/FnCdOQsX5kc", mood: ["scared"], trailerPreview: "" },
  { title: "The Matrix", description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.", genre: "Sci-Fi", year: 1999, duration: "2h 16m", rating: 4.9, isPremium: true, image: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVlLTM5YTctZjEwM2ZlZjk5OTgxXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg", banner: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920", trailer: "https://www.youtube.com/embed/vKQi3bBA1y8", videoUrl: "https://www.youtube.com/embed/vKQi3bBA1y8", mood: ["thoughtful", "excited"], trailerPreview: "" },
  { title: "Gravity", description: "Two astronauts work together to survive after an accident leaves them stranded in space.", genre: "Sci-Fi", year: 2013, duration: "1h 31m", rating: 4.4, isPremium: false, image: "https://m.media-amazon.com/images/M/MV5BNjE5MzYwMzYxMF5BMl5BanBnXkFtZTcwOTk4MTk0OQ@@._V1_.jpg", banner: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920", trailer: "https://www.youtube.com/embed/OiTiKOy59o4", videoUrl: "https://www.youtube.com/embed/OiTiKOy59o4", mood: ["excited", "thoughtful"], trailerPreview: "" },
  { title: "Dune", description: "The son of a noble family entrusted with the protection of the most valuable asset in the galaxy.", genre: "Sci-Fi", year: 2021, duration: "2h 35m", rating: 4.6, isPremium: true, image: "https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg", banner: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=1920", trailer: "https://www.youtube.com/embed/8g18jFHCLXk", videoUrl: "https://www.youtube.com/embed/8g18jFHCLXk", mood: ["thoughtful", "excited"], trailerPreview: "" },
  { title: "La La Land", description: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations.", genre: "Romance", year: 2016, duration: "2h 8m", rating: 4.5, isPremium: false, image: "https://m.media-amazon.com/images/M/MV5BMzUzNDM2NzM2MV5BMl5BanBnXkFtZTgwNTM3NTg4OTE@._V1_.jpg", banner: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1920", trailer: "https://www.youtube.com/embed/0pdqf4P9MB8", videoUrl: "https://www.youtube.com/embed/0pdqf4P9MB8", mood: ["romantic", "sad"], trailerPreview: "" },
  { title: "Pride and Prejudice", description: "Sparks fly when spirited Elizabeth Bennet meets single, rich, and proud Mr. Darcy who reluctantly finds himself falling in love with her.", genre: "Romance", year: 2005, duration: "2h 9m", rating: 4.6, isPremium: false, image: "https://m.media-amazon.com/images/M/MV5BMTA1NDQ3NTcyOTNeQTJeQWpwZ15BbWU3MDQ5MDE2MzQ@._V1_.jpg", banner: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1920", trailer: "https://www.youtube.com/embed/1dqte7CeRkI", videoUrl: "https://www.youtube.com/embed/1dqte7CeRkI", mood: ["romantic", "thoughtful"], trailerPreview: "" },
  { title: "Gone Girl", description: "With his wife's disappearance having become the focus of an intense media circus, a man sees the spotlight turned on him when suspected of not being innocent.", genre: "Thriller", year: 2014, duration: "2h 29m", rating: 4.5, isPremium: true, image: "https://m.media-amazon.com/images/M/MV5BMTk0MDQ3MzAzOV5BMl5BanBnXkFtZTgwNzU1NzE3MjE@._V1_.jpg", banner: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920", trailer: "https://www.youtube.com/embed/4Cs5oNhKOsQ", videoUrl: "https://www.youtube.com/embed/4Cs5oNhKOsQ", mood: ["thoughtful", "scared"], trailerPreview: "" },
  { title: "Parasite", description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.", genre: "Thriller", year: 2019, duration: "2h 12m", rating: 4.8, isPremium: true, image: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg", banner: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1920", trailer: "https://www.youtube.com/embed/5xH0HfJHsaY", videoUrl: "https://www.youtube.com/embed/5xH0HfJHsaY", mood: ["thoughtful", "scared"], trailerPreview: "" },
];

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
    await fixPosters(token, allMovies);

    console.log("🎬 Adding new movies...");
    let added = 0, skipped = 0;
    for (const movie of movies) {
      const exists = allMovies.find((m) => m.title.toLowerCase() === movie.title.toLowerCase());
      if (exists) { console.log(`⏭️  Skipped: ${movie.title}`); skipped++; continue; }
      try {
        await axios.post(`${BASE_URL}/api/movies`, movie, { headers: { Authorization: `Bearer ${token}` } });
        console.log(`✅ Added: ${movie.title}`);
        added++;
      } catch (err) {
        console.log(`❌ Failed: ${movie.title} — ${err.response?.data?.message || err.message}`);
      }
    }
    console.log(`\n🎉 Done! ${added} added, ${skipped} skipped, posters fixed!`);
  } catch (err) {
    console.error("❌ Login failed:", err.response?.data || err.message);
  }
}

run();