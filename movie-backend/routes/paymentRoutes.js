import express from "express";
import {
  initPayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/init",    protect, initPayment);

// ✅ Both GET and POST for success
router.get("/success",  paymentSuccess);
router.post("/success", paymentSuccess);

router.post("/fail",    paymentFail);
router.post("/cancel",  paymentCancel);
router.post("/ipn",     paymentIPN);

export default router;