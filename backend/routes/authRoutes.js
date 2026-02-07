const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });
  return res.status(200).json({ message: "Logged out" });
});
router.get("/me", authMiddleware, (req, res) => {
  return res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

module.exports = router;
