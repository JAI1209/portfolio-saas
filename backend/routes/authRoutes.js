const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", (req, res) => {
  return res.status(200).json({ message: "Logged out" });
});

module.exports = router;
