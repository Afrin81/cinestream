import axios from "axios";
import axios from "axios";

const API = axios.create({
  baseURL: "https://cinestream-backend-ng16.onrender.com/api",
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;