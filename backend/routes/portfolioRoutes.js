const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createPortfolio,
  getMyPortfolios,
  updatePortfolio,
  deletePortfolio,
  getAllPortfoliosAdmin,
  updatePortfolioStatus,
} = require("../controllers/portfolioController");

// 🔐 All portfolio routes are protected
router.use(authMiddleware);

/**
 * ===============================
 * USER ROUTES
 * ===============================
 */

// Create portfolio
router.post("/", createPortfolio);

// Get logged-in user's portfolios
router.get("/", getMyPortfolios);

// Update portfolio (owner only)
router.put("/:id", updatePortfolio);

// Delete portfolio (owner only)
router.delete("/:id", deletePortfolio);

/**
 * ===============================
 * ADMIN ROUTES
 * ===============================
 */

// Admin: view ALL portfolios
router.get(
  "/admin/all",
  roleMiddleware("admin"),
  getAllPortfoliosAdmin
);

// Admin: update portfolio status (draft / published)
router.patch(
  "/admin/:id/status",
  roleMiddleware("admin"),
  updatePortfolioStatus
);

module.exports = router;