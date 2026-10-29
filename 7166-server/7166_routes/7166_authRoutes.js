import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../7166_models/7166_User.js";
import authenticateUser from "../7166_middleware/7166_auth.js";
import Movie from "../7166_models/7166_Movie.js";
import {
  registerSchema,
  loginSchema,
} from "../7166_validations/7166_authValidation.js";

const router = express.Router();

function createToken(userId) {
  return jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function setTokenCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

// Register
router.post("/register", async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: false,
      convert: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration details.",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const { name, email, password } = value;
    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    setTokenCookie(res, createToken(user._id));

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    console.error("Registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create account.",
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
      convert: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid login details.",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const { email, password } = value;
    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password"
    );

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    setTokenCookie(res, createToken(user._id));

    return res.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to log in.",
    });
  }
});

// Check current session
router.get("/me", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found.",
      });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Unable to retrieve your account.",
    });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.json({
    success: true,
    message: "Logged out successfully.",
  });
});

/* Get the logged-in user's watchlist */
router.get("/watchlist", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("watchlist");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      movies: user.watchlist.filter(Boolean),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to load watchlist.",
    });
  }
});

/* Add a movie to the watchlist */
router.post("/watchlist/:movieId", authenticateUser, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found.",
      });
    }

    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { watchlist: movie._id },
    });

    return res.json({
      success: true,
      message: "Movie added to your library.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Unable to add movie to watchlist.",
    });
  }
});

/* Remove a movie from the watchlist */
router.delete(
  "/watchlist/:movieId",
  authenticateUser,
  async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.userId, {
        $pull: { watchlist: req.params.movieId },
      });

      return res.json({
        success: true,
        message: "Movie removed from your library.",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Unable to remove movie from watchlist.",
      });
    }
  }
);

export default router;