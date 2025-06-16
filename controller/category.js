const Category = require("../model/categoryModel"); // Adjust path if your model is in a different directory
const mongoose = require("mongoose"); // Required for ObjectId validation

// @desc    Create a new Category
// @route   POST /api/admin/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
  try {
    const { name, description, active } = req.body;

    // Basic validation
    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }

    // Check if a category with this name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Category with this name already exists." });
    }

    // Create the new category
    const category = await Category.create({
      name,
      description: description || "", // Use default if not provided
      active: active !== undefined ? active : true, // Set active based on input, default to true
    });

    return res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    console.error("Error creating category:", error);
    if (error.code === 11000) {
      // Duplicate key error from MongoDB
      return res.status(400).json({
        message: "A category with this name already exists.",
        error: error.message,
      });
    }
    return res.status(500).json({
      message: "An error occurred while creating the category",
      error: error.message,
    });
  }
};

// @desc    Get all Categories
// @route   GET /api/admin/categories
// @access  Private/Admin (or Public if filter dropdown needs it before login)
// This is the endpoint that will populate your Category filter dropdown in ProductList
exports.getAllCategories = async (req, res) => {
  try {
    // Optionally filter by active status if the frontend only needs active ones
    // Or add a query parameter to allow fetching all or only active
    const { activeOnly } = req.query;
    let query = {};
    if (activeOnly === "true") {
      query.active = true;
    }

    const categories = await Category.find(query).sort({ name: 1 });
    
    if (categories.length === 0) {
      return res
        .status(200)
        .json({ message: "No categories found.", categories: [] });
    }

    return res
      .status(200)
      .json({ message: "Categories fetched successfully", categories });
  } catch (error) {
    console.error("Error fetching all categories:", error);
    return res.status(500).json({
      message: "An error occurred while fetching categories",
      error: error.message,
    });
  }
};

// @desc    Get a single Category by ID
// @route   GET /api/admin/categories/:id
// @access  Private/Admin
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID format." });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    return res
      .status(200)
      .json({ message: "Category fetched successfully", category });
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    return res.status(500).json({
      message: "An error occurred while fetching the category",
      error: error.message,
    });
  }
};

// @desc    Update a Category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, active } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID format." });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Check for duplicate name if name is being updated and it's different from current
    if (name !== undefined && name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory && existingCategory._id.toString() !== id) {
        return res
          .status(400)
          .json({ message: "A category with this name already exists." });
      }
    }

    // Update fields if provided in the request body
    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    if (active !== undefined) category.active = active; // `active` is boolean directly

    const updatedCategory = await category.save();

    return res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "A category with this name already exists.",
        error: error.message,
      });
    }
    return res.status(500).json({
      message: "An error occurred while updating the category",
      error: error.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID format." });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    await category.deleteOne(); // Using deleteOne() on the found document

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({
      message: "An error occurred while deleting the category",
      error: error.message,
    });
  }
};
