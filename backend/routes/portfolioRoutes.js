const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createPortfolio,
  getMyPortfolios,
  updatePortfolioStatus,
  getPublishedPortfolios,
} = require("../controllers/portfolioController");

// 🌍 PUBLIC — no auth
router.get("/public", getPublishedPortfolios);

// 🔐 Everything below requires authentication
router.use(authMiddleware);

// 👤 USER routes
router.post("/", createPortfolio);
router.get("/", getMyPortfolios);

// 👑 ADMIN routes
router.patch(
  "/admin/:id/status",
  roleMiddleware("admin"),
  updatePortfolioStatus
);

module.exports = router;