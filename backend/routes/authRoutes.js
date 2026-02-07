const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", (req, res) => {
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    path: "/",
  });
  return res.status(200).json({ message: "Logged out" });
});
router.get("/me", authMiddleware, (req, res) => {
  return res.status(200).json({ user: req.user });
});

module.exports = router;
