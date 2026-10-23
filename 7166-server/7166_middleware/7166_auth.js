
import jwt from "jsonwebtoken";

export default function authenticateUser(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please log in first.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Session expired. Please log in again.",
    });
  }
}
