import express from "express";
import { getAdminStats, getAllUsers, deleteUser } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected and admin only
router.get("/stats",        protect, adminOnly, getAdminStats);  // GET /api/admin/stats
router.get("/users",        protect, adminOnly, getAllUsers);     // GET /api/admin/users
router.delete("/users/:id", protect, adminOnly, deleteUser);     // DELETE /api/admin/users/:id

export default router;