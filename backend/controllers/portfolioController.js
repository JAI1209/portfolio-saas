const Portfolio = require("../models/Portfolio");

/**
 * =====================================
 * CREATE Portfolio
 * POST /api/portfolios
 * Private
 * =====================================
 */
exports.createPortfolio = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const portfolio = await Portfolio.create({
      title,
      description,
      user: req.user._id, // 🔐 ownership binding
    });

    res.status(201).json({
      message: "Portfolio created successfully",
      portfolio,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create portfolio",
      error: error.message,
    });
  }
};

/**
 * =====================================
 * READ Portfolios (Logged-in User)
 * GET /api/portfolios
 * Private
 * =====================================
 */
exports.getMyPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(portfolios);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch portfolios",
      error: error.message,
    });
  }
};

/**
 * =====================================
 * UPDATE Portfolio (Owner only)
 * PUT /api/portfolios/:id
 * Private
 * =====================================
 */
exports.updatePortfolio = async (req, res) => {
  try {
    const { title, description } = req.body;

    const portfolio = await Portfolio.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id, // 🔐 ownership enforcement
      },
      {
        title,
        description,
      },
      { new: true }
    );

    if (!portfolio) {
      return res.status(404).json({
        message: "Portfolio not found or not authorized",
      });
    }

    res.status(200).json({
      message: "Portfolio updated successfully",
      portfolio,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update portfolio",
      error: error.message,
    });
  }
};

/**
 * =====================================
 * DELETE Portfolio (Owner only)
 * DELETE /api/portfolios/:id
 * Private
 * =====================================
 */
exports.deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id, // 🔐 ownership enforcement
    });

    if (!portfolio) {
      return res.status(404).json({
        message: "Portfolio not found or not authorized",
      });
    }

    res.status(200).json({
      message: "Portfolio deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete portfolio",
      error: error.message,
    });
  }
};