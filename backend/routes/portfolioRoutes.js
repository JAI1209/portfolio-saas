const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createPortfolio,
  getMyPortfolios
} = require("../controllers/portfolioController");

const router = express.Router();

// CREATE
router.post("/", authMiddleware, createPortfolio);

// READ (✅ ADD THIS)
router.get("/", authMiddleware, getMyPortfolios);

module.exports = router;
