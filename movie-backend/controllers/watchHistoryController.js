import WatchHistory from "../models/WatchHistory.js";

// ✅ Save watch history
// POST /api/watch/save
export const saveWatch = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.user._id;

    await WatchHistory.create({ userId, movieId });

    res.json({ success: true, message: "Watch recorded!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get most watched movies
// GET /api/watch/most-watched?days=7
export const getMostWatched = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;

    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    const mostWatched = await WatchHistory.aggregate([
      {
        $match: {
          watchedAt: { $gte: dateFrom },
        },
      },
      {
        $group: {
          _id: "$movieId",
          watchCount: { $sum: 1 },
        },
      },
      {
        $sort: { watchCount: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "movies",
          localField: "_id",
          foreignField: "_id",
          as: "movie",
        },
      },
      {
        $unwind: "$movie",
      },
      {
        $project: {
          _id: "$movie._id",
          title: "$movie.title",
          genre: "$movie.genre",
          year: "$movie.year",
          rating: "$movie.rating",
          image: "$movie.image",
          banner: "$movie.banner",
          trailer: "$movie.trailer",
          videoUrl: "$movie.videoUrl",
          isPremium: "$movie.isPremium",
          description: "$movie.description",
          duration: "$movie.duration",
          watchCount: 1,
        },
      },
    ]);

    res.json({
      success: true,
      days,
      movies: mostWatched,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};