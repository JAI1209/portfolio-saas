const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createPortfolio,
  getMyPortfolios,
  updatePortfolioStatus,
  getPublishedPortfolios,
  getPublishedPortfolioById, // ✅ REQUIRED
} = require("../controllers/portfolioController");

/**
 * ===============================
 * 🌍 PUBLIC ROUTES (NO AUTH)
 * ===============================
 */

// List all published portfolios
router.get("/public", getPublishedPortfolios);

// Get single published portfolio by ID
router.get("/public/:id", getPublishedPortfolioById);

/**
 * ===============================
 * 🔐 AUTHENTICATED ROUTES
 * ===============================
 */
router.use(authMiddleware);

/**
 * 👤 USER ROUTES
 */
router.post("/", createPortfolio);
router.get("/", getMyPortfolios);

/**
 * 👑 ADMIN ROUTES
 */
router.patch(
  "/admin/:id/status",
  roleMiddleware("admin"),
  updatePortfolioStatus
);

module.exports = router;