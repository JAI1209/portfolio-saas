const Portfolio = require("../models/Portfolio");

// CREATE portfolio
exports.createPortfolio = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const portfolio = await Portfolio.create({
      title,
      description,
      user: req.user._id,
    });

    res.status(201).json({
      message: "Portfolio created successfully",
      portfolio,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create portfolio" });
  }
};

// READ logged-in user's portfolios
exports.getMyPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: portfolios.length,
      portfolios,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch portfolios" });
  }
};
