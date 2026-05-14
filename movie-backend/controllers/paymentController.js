import SSLCommerzPayment from "sslcommerz-lts";
import User from "../models/User.js";

// ✅ Initialize Payment
// POST /api/payment/init
export const initPayment = async (req, res) => {
  try {
    const { plan } = req.body;
    const user = req.user;

    if (!plan || !["monthly", "yearly"].includes(plan)) {
      return res.status(400).json({ message: "Invalid plan!" });
    }

    // Plan details
    const planDetails = {
      monthly: { amount: 199, name: "Monthly Premium" },
      yearly:  { amount: 1499, name: "Yearly Premium" },
    };

    const selectedPlan = planDetails[plan];
    const transactionId = "CINE_" + Date.now() + "_" + user._id;

    // SSLCommerz data
    const data = {
      total_amount:  selectedPlan.amount,
      currency:      "BDT",
      tran_id:       transactionId,
      success_url:   `${process.env.BACKEND_URL}/api/payment/success?tran_id=${transactionId}&plan=${plan}&userId=${user._id}`,
      fail_url:      `${process.env.FRONTEND_URL}/payment?status=failed`,
      cancel_url:    `${process.env.FRONTEND_URL}/payment?status=cancelled`,
      ipn_url:       `${process.env.BACKEND_URL}/api/payment/ipn`,
      product_name:  selectedPlan.name,
      product_category: "Subscription",
      product_profile:  "general",
      cus_name:      user.name,
      cus_email:     user.email,
      cus_add1:      "Dhaka",
      cus_city:      "Dhaka",
      cus_country:   "Bangladesh",
      cus_phone:     "01700000000",
      ship_name:     user.name,
      ship_add1:     "Dhaka",
      ship_city:     "Dhaka",
      ship_country:  "Bangladesh",
      shipping_method: "NO",
      num_of_item:   1,
      emi_option:    0,
    };

    const isLive = false; // sandbox mode for testing
    const sslcommerz = new SSLCommerzPayment(
      process.env.SSLCOMMERZ_STORE_ID,
      process.env.SSLCOMMERZ_STORE_PASSWORD,
      isLive
    );

    const response = await sslcommerz.init(data);

    if (response?.GatewayPageURL) {
      res.json({
        success: true,
        paymentUrl: response.GatewayPageURL,
        transactionId,
      });
    } else {
      res.status(500).json({ message: "Payment initialization failed!" });
    }
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Payment Success
// GET /api/payment/success
export const paymentSuccess = async (req, res) => {
  try {
    const { tran_id, plan, userId } = req.query;

    // Calculate expiry
    const expiresAt = new Date();
    if (plan === "monthly") {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }

    // Update user to premium
    await User.findByIdAndUpdate(userId, {
      isPremium: true,
      premiumExpiresAt: expiresAt,
    });

    // Redirect to frontend success page
    res.redirect(
      `${process.env.FRONTEND_URL}/payment/success?plan=${plan}&tran_id=${tran_id}`
    );
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/payment?status=failed`);
  }
};

// ✅ Payment Failed
// POST /api/payment/fail
export const paymentFail = async (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/payment?status=failed`);
};

// ✅ Payment Cancelled
// POST /api/payment/cancel
export const paymentCancel = async (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/payment?status=cancelled`);
};

// ✅ IPN (Instant Payment Notification)
// POST /api/payment/ipn
export const paymentIPN = async (req, res) => {
  res.status(200).json({ message: "IPN received" });
};