import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    watchlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
      },
    ],
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
