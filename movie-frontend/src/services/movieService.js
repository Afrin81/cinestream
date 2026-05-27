import API from "./api.js";

// ✅ Get all movies
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

// ✅ Save watch history to backend
export const saveWatchHistory = async (movieId) => {
  try {
    const response = await API.post("/watch/save", { movieId });
    return response.data;
  } catch (error) {
    console.error("Error saving watch history:", error);
    return null;
  }
};

// ✅ Get most watched movies
export const getMostWatched = async (days = 7) => {
  try {
    const response = await API.get(`/watch/most-watched?days=${days}`);
    return response.data.movies;
  } catch (error) {
    console.error("Error fetching most watched:", error);
    return [];
  }
};