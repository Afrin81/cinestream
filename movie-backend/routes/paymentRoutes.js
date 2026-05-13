import express from "express";
import { subscribe, getPremiumStatus } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/subscribe",  protect, subscribe);        // POST /api/payment/subscribe
router.get("/status",      protect, getPremiumStatus); // GET /api/payment/status

export default router;