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
      status: status || "draft", // 👈 default handled safely
      user: req.user._id,
    });

    res.status(201).json(portfolio);
  } catch (error) {
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
    const portfolios = await Portfolio.find({ user: req.user._id });
    res.json(portfolios);
  } catch (error) {
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
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    res.json(portfolio);
  } catch (error) {
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
    const portfolio = await Portfolio.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    res.json(portfolio);
  } catch (error) {
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
    const portfolio = await Portfolio.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    res.json({ message: "Portfolio deleted successfully" });
  } catch (error) {
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
    const portfolios = await Portfolio.find().populate(
      "user",
      "name email role"
    );

    res.json({
      count: portfolios.length,
      portfolios,
    });
  } catch (error) {
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
    const { status } = req.body;

    if (!["draft", "published"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    res.json({
      message: "Portfolio status updated successfully",
      portfolio,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update portfolio status" });
  }
};




/**
 * ===============================
 * ADMIN: Update Portfolio Status
 * ===============================
 */
exports.updatePortfolioStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["draft", "published"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "name email");

    if (!portfolio) {
      return res.status(404).json({
        message: "Portfolio not found",
      });
    }

    res.json({
      message: "Portfolio status updated",
      portfolio,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update portfolio status",
    });
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
    res.status(500).json({
      message: "Failed to fetch published portfolios",
    });
  }
};