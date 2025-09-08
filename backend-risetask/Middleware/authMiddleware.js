import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  try {
    const authHeader = req.headers.authorization;

    // 🔹 Check token
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // 🔹 Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Token invalid" });
    }

    // 🔹 User find
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next(); // آگے بڑھو 🚀
  } catch (error) {
    console.error("Auth Error:", error.message);
    res.status(500).json({ message: "Server error in auth middleware" });
  }
};

export default protect;
