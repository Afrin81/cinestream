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

router.post("/init",    protect, initPayment);    // POST /api/payment/init
router.get("/success",  paymentSuccess);           // GET  /api/payment/success
router.post("/fail",    paymentFail);              // POST /api/payment/fail
router.post("/cancel",  paymentCancel);            // POST /api/payment/cancel
router.post("/ipn",     paymentIPN);               // POST /api/payment/ipn

export default router;