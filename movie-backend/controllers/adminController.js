import User from "../models/User.js";
import Movie from "../models/Movie.js";

// ✅ Get admin stats
// GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    const totalMovies   = await Movie.countDocuments();
    const totalUsers    = await User.countDocuments();
    const premiumUsers  = await User.countDocuments({ isPremium: true });
    const premiumMovies = await Movie.countDocuments({ isPremium: true });
    const freeUsers     = await User.countDocuments({ isPremium: false });
    const freeMovies    = await Movie.countDocuments({ isPremium: false });

    // Get top rated movie
    const topMovie = await Movie.findOne().sort({ rating: -1 });

    // Get recent users
    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent movies
    const recentMovies = await Movie.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalMovies,
        totalUsers,
        premiumUsers,
        premiumMovies,
        freeUsers,
        freeMovies,
      },
      topMovie,
      recentUsers,
      recentMovies,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all users
// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete user
// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting admin
    if (user.isAdmin) {
      return res.status(400).json({ message: "Cannot delete admin user!" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};