const productModel = require("../model/productModel");
const Category = require("../model/categoryModel");
const mongoose  = require("mongoose");

exports.createProduct = async (req, res) => {
  try {
    // 1. Destructure fields from req.body.
    // Expect `categoryId` instead of `category` string.
    const {
      productName,
      description,
      price,
      category: categoryId,
      featured,
    } = req.body;

    // 2. Validate essential text fields including the categoryId
    if (!productName || !description || !price || !categoryId) {
      return res.status(400).json({
        message:
          "All product text fields (name, description, price, category ID) are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID format." });
    }
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res
        .status(404)
        .json({ message: "Category not found with the provided ID." });
    }

    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ message: "Product image is required." });
    }

    const imagePath = imageFile.path;

    const isFeatured = featured === "true" || featured === true; 

    const product = await productModel.create({
      productName,
      description,
      image: [imagePath],
      price,
      category: categoryId,
      featured: isFeatured,
    });

    const populatedProduct = await productModel
      .findById(product._id)
      .populate("category", "name");

    return res
      .status(201)
      .json({
        message: "Product created successfully",
        product: populatedProduct,
      });
  } catch (error) {
    console.error("Error creating product:", error);

    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "Image file too large.", error: error.message });
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        message: `Unexpected file field. Ensure frontend sends file as 'productImage'.`,
        error: error.message,
      });
    }

    return res.status(500).json({
      message:
        "An unexpected server error occurred while creating the product.",
      error: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      price,
      category: categoryId,
      inStock,
      featured,
    } = req.body;
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    if (categoryId) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID format." });
      }
      const existingCategory = await Category.findById(categoryId);
      if (!existingCategory) {
        return res
          .status(404)
          .json({ message: "Category not found with the provided ID." });
      }
      product.category = categoryId;
    }

    if (productName !== undefined) product.productName = productName;
    if (price !== undefined) product.price = price;
    if (description !== undefined) product.description = description;
    if (inStock !== undefined)
      product.inStock = inStock === "true" || inStock === true;
    if (featured !== undefined)
      product.featured = featured === "true" || featured === true; 

    if (req.file?.path) {
      product.image = [req.file.path]; 
    }

    const updatedProduct = await product.save();

    const populatedUpdatedProduct = await productModel
      .findById(updatedProduct._id)
      .populate("category", "name");

    return res
      .status(200)
      .json({ message: "Product updated", updated: populatedUpdatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    return res
      .status(500)
      .json({
        message: "An error occurred during product update",
        error: error.message,
      });
  }
};

exports.deleteMultipleProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: "No product IDs provided for deletion." });
    }

    const result = await productModel.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({
          message: "No products found to delete with the provided IDs.",
        });
    }

    return res
      .status(200)
      .json({
        message: `${result.deletedCount} products deleted successfully.`,
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "An error occurred during batch deletion",
        error: error.message,
      });
  }
};

exports.getByCategory = async (req, res) => {
  try {
    const { category: categoryName } = req.query;

    if (!categoryName) {
      return res
        .status(400)
        .json({ message: "Category name is required for filtering." });
    }

    const categoryDoc = await Category.findOne({ name: categoryName });

    if (!categoryDoc) {
      return res
        .status(404)
        .json({ message: "Category not found.", product: [] });
    }

    const products = await productModel
      .find({ category: categoryDoc._id })
      .populate("category", "name");

    if (products.length === 0) {
      return res
        .status(404)
        .json({
          message: `No products found in the category: ${categoryName}`,
          product: [],
        });
    }

    return res
      .status(200)
      .json({
        message: `Products gotten by category: ${categoryName}`,
        product: products,
      });
  } catch (error) {
    console.error("Error getting products by category:", error);
    return res
      .status(500)
      .json({
        message: "An error occurred while getting products by category",
        error: error.message,
      });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const product = await productModel.find().populate("category", "name");

    return res.status(200).json({ message: "All products", product });
  } catch (error) {
    console.error("Error getting all products:", error);

    return res
      .status(500)
      .json({
        message: "An error occurred while getting all products",
        error: error.message,
      });
  }
};