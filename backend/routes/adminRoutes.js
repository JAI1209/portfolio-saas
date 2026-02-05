const express = require("express");
const router = express.Router();
const ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ODM0ZTY4ZmVhMzIzNDU2MDNhZWViMCIsImlhdCI6MTc3MDIxMzAxNywiZXhwIjoxNzcwODE3ODE3fQ.3rOnu2RPxAOkjKlMzp_ZI-5GJRt5-lp9HYjQEcPDDqY"; // dev-only


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