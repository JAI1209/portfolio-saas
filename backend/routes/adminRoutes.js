const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  getAllPortfoliosAdmin,
} = require("../controllers/portfolioController");

// 🔐 Admin-only routes
router.use(authMiddleware);
router.use(roleMiddleware("admin"));

// 📌 GET ALL portfolios (ADMIN)
router.get("/portfolios", getAllPortfoliosAdmin);

module.exports = router;