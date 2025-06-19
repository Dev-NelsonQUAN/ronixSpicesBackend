const Category = require("../model/categoryModel");
// eslint-disable-next-line no-unused-vars
const Product = require("../model/productModel"); // Product model is used implicitly by $lookup for collection name lookup
const mongoose = require("mongoose");

exports.createCategory = async (req, res) => {
  try {
    const { name, description, active } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Category with this name already exists." });
    }

    const category = await Category.create({
      name,
      description: description || "",
      active: active !== undefined ? active : true,
    });

    return res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    console.error("Error creating category:", error);
    if (error.code === 11000) {
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

// Updated getAllCategories to include product count
exports.getAllCategories = async (req, res) => {
  try {
    const { activeOnly } = req.query;
    let matchQuery = {};
    if (activeOnly === "true") {
      matchQuery.active = true;
    }

    const categories = await Category.aggregate([
      // Stage 1: Filter categories based on activeOnly query parameter
      {
        $match: matchQuery,
      },
      // Stage 2: Join with the 'products' collection
      {
        $lookup: {
          from: "products", // The name of the products collection in MongoDB
          localField: "_id", // Field from the input documents (Category's _id)
          foreignField: "category", // Field from the "products" documents (Product's category field)
          as: "productsData", // The array field to add to the input documents
        },
      },
      // Stage 3: Add a new field 'productCount' which is the size of the 'productsData' array
      {
        $addFields: {
          productCount: { $size: "$productsData" },
        },
      },
      // Stage 4: Project (select) the fields you want to return and exclude the temporary 'productsData'
      // FIX: Removed productsData: 0, as it's implicitly excluded by not being listed for inclusion.
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          active: 1,
          createdAt: 1,
          updatedAt: 1,
          productCount: 1, // Include the new productCount field
          // productsData is now implicitly excluded because it's not listed here with '1'
        },
      },
      // Stage 5: Sort the results by category name
      {
        $sort: { name: 1 },
      },
    ]);

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

    if (name !== undefined && name !== category.name) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory && existingCategory._id.toString() !== id) {
        return res
          .status(400)
          .json({ message: "A category with this name already exists." });
      }
    }

    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    if (active !== undefined) category.active = active;

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

    await category.deleteOne();

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({
      message: "An error occurred while deleting the category",
      error: error.message,
    });
  }
};
