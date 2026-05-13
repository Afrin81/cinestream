import mongoose from "mongoose";

// 🎬 Movie Schema — defines how movie data is stored in MongoDB
const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: "",
    },
    banner: {
      type: String,
      default: "",
    },
    trailer: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    mood: {
      type: [String],
      default: [],
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    trailerPreview: {
  type: String,
  default: "",
},
    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;