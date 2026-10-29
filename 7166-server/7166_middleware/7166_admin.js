import User from "../7166_models/7166_User.js";

export default async function requireAdmin(req, res, next) {
  try {
    const user = await User.findById(req.userId).select("role email");

    console.log("Admin authorization debug:", {
      userId: req.userId,
      email: user?.email,
      role: user?.role,
      collection: User.collection.name,
      database: User.db.name,
    });

    console.log("Admin check:", {
      userId: req.userId,
      foundUser: Boolean(user),
      role: user?.role,
    });

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }

    next();
  } catch (error) {
    console.error("Admin authorization error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to verify admin permissions.",
    });
  }
}
