const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxLength: [50, "Category name cannot be more than 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [
        200,
        "Category description cannot be more than 200 characters",
      ],
      default: "",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
