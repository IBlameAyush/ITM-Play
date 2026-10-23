import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    genre: {
      type: [String],
      required: true,
    },
    releaseYear: {
      type: Number,
      required: true,
    },
    posterUrl: {
      type: String,
      default: "",
    },
    backdropUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
