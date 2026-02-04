const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft", // 🚨 CRITICAL
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);