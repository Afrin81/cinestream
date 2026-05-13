import axios from "axios";

// 🔗 Base URL of our backend
const API = axios.create({
  baseURL: "https://cinestream-backend-ng16.onrender.com/api",
  withCredentials: true,
});

// 🔐 Automatically add token to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;