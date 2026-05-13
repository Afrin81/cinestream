import API from "./api.js";

// ✅ Get all movies
// Later connects to: GET /api/movies
export const getAllMovies = async (filters = {}) => {
  try {
    const response = await API.get("/movies", { params: filters });
    return response.data.movies;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

// ✅ Get movie by id
// Later connects to: GET /api/movies/:id
export const getMovieById = async (id) => {
  try {
    const response = await API.get(`/movies/${id}`);
    return response.data.movie;
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
};

// ✅ Get similar movies
// Later connects to: GET /api/movies/:id/similar
export const getSimilarMovies = async (id) => {
  try {
    const response = await API.get(`/movies/${id}/similar`);
    return response.data.movies;
  } catch (error) {
    console.error("Error fetching similar movies:", error);
    return [];
  }
};

// ✅ Get movies by mood
export const getMoviesByMood = async (mood) => {
  try {
    const response = await API.get("/movies", { params: { mood } });
    return response.data.movies;
  } catch (error) {
    console.error("Error fetching movies by mood:", error);
    return [];
  }
};

// ✅ Rate a movie
export const rateMovie = async (id, rating) => {
  try {
    const response = await API.post(`/movies/${id}/rate`, { rating });
    return response.data;
  } catch (error) {
    console.error("Error rating movie:", error);
    return null;
  }
};