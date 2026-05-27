import express from "express";
import { saveWatch, getMostWatched } from "../controllers/watchHistoryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/save",        protect, saveWatch);
router.get("/most-watched", getMostWatched);

export default router;