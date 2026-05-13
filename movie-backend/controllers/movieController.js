import Movie from "../models/Movie.js";

// ✅ Get all movies
// GET /api/movies
export const getAllMovies = async (req, res) => {
  try {
    const { genre, mood, search } = req.query;

    // Build filter object
    let filter = {};

    if (genre && genre !== "All") {
      filter.genre = genre;
    }

    if (mood) {
      filter.mood = { $in: [mood] };
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const movies = await Movie.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: movies.length,
      movies,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get single movie
// GET /api/movies/:id
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json({
      success: true,
      movie,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get similar movies
// GET /api/movies/:id/similar
export const getSimilarMovies = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const similarMovies = await Movie.find({
      genre: movie.genre,
      _id: { $ne: movie._id }, // exclude current movie
    }).limit(6);

    res.json({
      success: true,
      movies: similarMovies,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Add new movie (admin only)
// POST /api/movies
export const addMovie = async (req, res) => {
  try {
    const {
      title, description, genre, year,
      duration, rating, isPremium,
      image, banner, trailer, videoUrl, mood,
    } = req.body;

    // Check required fields
    if (!title || !description || !genre || !year || !duration) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const movie = await Movie.create({
      title, description, genre, year,
      duration, rating, isPremium,
      image, banner, trailer, videoUrl, mood,
    });

    res.status(201).json({
      success: true,
      message: "Movie added successfully!",
      movie,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update movie (admin only)
// PUT /api/movies/:id
export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return updated movie
    );

    res.json({
      success: true,
      message: "Movie updated successfully!",
      movie: updatedMovie,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete movie (admin only)
// DELETE /api/movies/:id
export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    await Movie.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Movie deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Rate a movie
// POST /api/movies/:id/rate
export const rateMovie = async (req, res) => {
  try {
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Calculate new average rating
    movie.totalRatings += rating;
    movie.ratingCount += 1;
    movie.rating = (movie.totalRatings / movie.ratingCount).toFixed(1);

    await movie.save();

    res.json({
      success: true,
      message: "Rating submitted!",
      rating: movie.rating,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};