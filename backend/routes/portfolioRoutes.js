const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createPortfolio,
  getMyPortfolios,
} = require("../controllers/portfolioController");

// 🔐 All portfolio routes are private
router.use(authMiddleware);

// 📌 Create portfolio
router.post("/", createPortfolio);

// 📌 Get logged-in user's portfolios
router.get("/", getMyPortfolios);

module.exports = router;