import User from "../models/User.js";

// ✅ Process Payment (SSLCommerz simulation for now)
// POST /api/payment/subscribe
export const subscribe = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.user._id;

    if (!plan || !["monthly", "yearly"].includes(plan)) {
      return res.status(400).json({ message: "Invalid plan selected!" });
    }

    // Calculate expiry date
    const expiresAt = new Date();
    if (plan === "monthly") {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }

    // Update user to premium
    const user = await User.findByIdAndUpdate(
      userId,
      {
        isPremium: true,
        premiumExpiresAt: expiresAt,
      },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Payment successful! Welcome to Premium!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        isAdmin: user.isAdmin,
        premiumExpiresAt: user.premiumExpiresAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Check premium status
// GET /api/payment/status
export const getPremiumStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    // Check if premium expired
    if (user.isPremium && user.premiumExpiresAt) {
      if (new Date() > new Date(user.premiumExpiresAt)) {
        // Premium expired — update user
        await User.findByIdAndUpdate(req.user._id, { isPremium: false });
        return res.json({
          success: true,
          isPremium: false,
          message: "Premium subscription expired",
        });
      }
    }

    res.json({
      success: true,
      isPremium: user.isPremium,
      premiumExpiresAt: user.premiumExpiresAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};