import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  createAdmin,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register",      registerUser); // POST /api/auth/register
router.post("/login",         loginUser);    // POST /api/auth/login
router.post("/create-admin",  createAdmin);  // POST /api/auth/create-admin

// Protected routes (need to be logged in)
router.get("/me", protect, getMe); // GET /api/auth/me

export default router;