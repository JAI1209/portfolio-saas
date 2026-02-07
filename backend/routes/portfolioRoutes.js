const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createPortfolio,
  getMyPortfolios,
  updateMyPortfolioStatus,
  updatePortfolioStatus,
  getPublishedPortfolios,
  getPublishedPortfolioById,
  getAllPortfoliosAdmin,
} = require("../controllers/portfolioController");

// PUBLIC ROUTES (NO AUTH)
router.get("/public", getPublishedPortfolios);
router.get("/public/:id", getPublishedPortfolioById);

// AUTHENTICATED ROUTES
router.use(authMiddleware);

// USER ROUTES
router.post("/", createPortfolio);
router.get("/", getMyPortfolios);
router.patch("/:id/status", updateMyPortfolioStatus);

// ADMIN ROUTES
router.get("/admin", roleMiddleware("admin"), getAllPortfoliosAdmin);
router.patch("/admin/:id/status", roleMiddleware("admin"), updatePortfolioStatus);

module.exports = router;
