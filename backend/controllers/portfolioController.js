const mongoose = require("mongoose");
const Portfolio = require("../models/Portfolio");

/**
 * ===============================
 * USER: Create Portfolio
 * ===============================
 */
exports.createPortfolio = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const portfolio = await Portfolio.create({
      title,
      description,
      status: status || "draft",
      user: req.user._id,
    });

    res.status(201).json(portfolio);
  } catch (error) {
    console.error("❌ createPortfolio:", error);
    res.status(500).json({ message: "Failed to create portfolio" });
  }
};

/**
 * ===============================
 * USER: Get My Portfolios
 * ===============================
 */
exports.getMyPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(portfolios);
  } catch (error) {
    console.error("❌ getMyPortfolios:", error);
    res.status(500).json({ message: "Failed to fetch portfolios" });
  }
};

/**
 * ===============================
 * USER: Get Single Portfolio (Owner only)
 * ===============================
 */
exports.getPortfolioById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid portfolio ID" });
    }

    const portfolio = await Portfolio.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    res.json(portfolio);
  } catch (error) {
    console.error("❌ getPortfolioById:", error);
    res.status(500).json({ message: "Failed to fetch portfolio" });
  }
};

/**
 * ===============================
 * USER: Update Portfolio (Owner only)
 * ===============================
 */
exports.updatePortfolio = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid portfolio ID" });
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      { _id: id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    res.json(portfolio);
  } catch (error) {
    console.error("❌ updatePortfolio:", error);
    res.status(500).json({ message: "Failed to update portfolio" });
  }
};

/**
 * ===============================
 * USER: Delete Portfolio (Owner only)
 * ===============================
 */
exports.deletePortfolio = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid portfolio ID" });
    }

    const portfolio = await Portfolio.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    res.json({ message: "Portfolio deleted successfully" });
  } catch (error) {
    console.error("❌ deletePortfolio:", error);
    res.status(500).json({ message: "Failed to delete portfolio" });
  }
};

/**
 * ===============================
 * ADMIN: Get ALL Portfolios
 * ===============================
 */
exports.getAllPortfoliosAdmin = async (req, res) => {
  try {
    const portfolios = await Portfolio.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      count: portfolios.length,
      portfolios,
    });
  } catch (error) {
    console.error("❌ getAllPortfoliosAdmin:", error);
    res.status(500).json({ message: "Failed to fetch portfolios" });
  }
};

/**
 * ===============================
 * ADMIN: Update Portfolio Status
 * ===============================
 */
exports.updatePortfolioStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid portfolio ID" });
    }

    if (!["draft", "published"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const portfolio = await Portfolio.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("user", "name email");

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    res.json({
      message: "Portfolio status updated successfully",
      portfolio,
    });
  } catch (error) {
    console.error("❌ updatePortfolioStatus:", error);
    res.status(500).json({ message: "Failed to update portfolio status" });
  }
};

/**
 * ===============================
 * PUBLIC: Get Published Portfolios
 * ===============================
 */
exports.getPublishedPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ status: "published" })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json({
      count: portfolios.length,
      portfolios,
    });
  } catch (error) {
    console.error("❌ getPublishedPortfolios:", error);
    res.status(500).json({ message: "Failed to fetch published portfolios" });
  }
};

/**
 * ===============================
 * PUBLIC: Get Published Portfolio by ID
 * ===============================
 */
exports.getPublishedPortfolioById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid portfolio ID" });
    }

    const portfolio = await Portfolio.findOne({
      _id: id,
      status: "published",
    }).populate("user", "name email");

    if (!portfolio) {
      return res
        .status(404)
        .json({ message: "Published portfolio not found" });
    }

    res.json(portfolio);
  } catch (error) {
    console.error("❌ getPublishedPortfolioById:", error);
    res.status(500).json({ message: "Failed to fetch portfolio" });
  }
};