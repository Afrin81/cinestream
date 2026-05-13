import express from "express";
import {
  getAllMovies,
  getMovieById,
  getSimilarMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  rateMovie,
} from "../controllers/movieController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ── Public Routes (no login needed) ──
router.get("/",           getAllMovies);    // GET /api/movies
router.get("/:id",        getMovieById);   // GET /api/movies/:id
router.get("/:id/similar", getSimilarMovies); // GET /api/movies/:id/similar

// ── Protected Routes (login needed) ──
router.post("/:id/rate", protect, rateMovie); // POST /api/movies/:id/rate

// ── Admin Only Routes ──
router.post("/",      protect, adminOnly, addMovie);    // POST /api/movies
router.put("/:id",    protect, adminOnly, updateMovie); // PUT /api/movies/:id
router.delete("/:id", protect, adminOnly, deleteMovie); // DELETE /api/movies/:id

export default router;