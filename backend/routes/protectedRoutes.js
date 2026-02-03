const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Example protected endpoint
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Protected data access granted",
    user: req.user,
  });
});

module.exports = router;
