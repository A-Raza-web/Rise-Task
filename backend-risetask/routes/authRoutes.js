import express from "express";
import AuthController from "../controllers/authController.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();
const authController = new AuthController();

// Public routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Protected route example
router.get("/profile", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Profile data", user: req.user });
});

export default router;
