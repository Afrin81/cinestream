import API from "./api.js";

// ✅ Get admin stats
export const getAdminStats = async () => {
  try {
    const response = await API.get("/admin/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return null;
  }
};

// ✅ Get all users
export const getAdminUsers = async () => {
  try {
    const response = await API.get("/admin/users");
    return response.data.users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// ✅ Delete user
export const deleteAdminUser = async (id) => {
  try {
    const response = await API.delete(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    return null;
  }
};

// ✅ Add movie
export const addAdminMovie = async (movieData) => {
  try {
    const response = await API.post("/movies", movieData);
    return response.data;
  } catch (error) {
    console.error("Error adding movie:", error);
    return null;
  }
};

// ✅ Update movie
export const updateAdminMovie = async (id, movieData) => {
  try {
    const response = await API.put(`/movies/${id}`, movieData);
    return response.data;
  } catch (error) {
    console.error("Error updating movie:", error);
    return null;
  }
};

// ✅ Delete movie
export const deleteAdminMovie = async (id) => {
  try {
    const response = await API.delete(`/movies/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting movie:", error);
    return null;
  }
};