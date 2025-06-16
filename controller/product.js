const productModel = require("../model/productModel");

exports.createProduct = async (req, res) => {
  try {
    // 1. Destructure text fields from req.body
    const { productName, description, price, category, featured } = req.body;

    // 2. Validate essential text fields first
    if (!productName || !description || !price || !category) {
      return res
        .status(400)
        .json({
          message:
            "All product text fields (name, description, price, category) are required.",
        });
    }

    // 3. Access the single file from req.file (singular)
    const imageFile = req.file;

    // 4. Validate image file existence
    if (!imageFile) {
      return res.status(400).json({ message: "Product image is required." });
    }

    const imagePath = imageFile.path;

    const isFeatured = featured === "true" || featured === true;

    const product = await productModel.create({
      productName,
      description,
      image: imagePath,
      price,
      category,
      featured: isFeatured,
    });

    return res
      .status(201)
      .json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Error creating product:", error); // Log the detailed error on the server

    // Multer error handling (still relevant)
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "Image file too large.", error: error.message });
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      // This error now specifically means the frontend's field name does not match 'productImage'
      return res
        .status(400)
        .json({
          message: `Unexpected file field. Ensure frontend sends file as 'productImage'.`,
          error: error.message,
        });
    }

    // Generic server error
    return res
      .status(500)
      .json({
        message:
          "An unexpected server error occurred while creating the product.",
        error: error.message,
      });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { productName, description, price, category } = req.body;
    const product = await productModel.findById(req.params.id);

    if (!product) return res.status(400).json({ message: "Product not found" });

    product.productName = productName || product.productName;
    product.price = price || product.price;
    product.category = category || product.category;
    product.description = description || product.description;

    if (req.file?.path) product.image = req.file.path;

    const updated = await product.save();
    return res.status(200).json({ message: "Product updated", updated });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};


exports.deleteMultipleProducts = async (req, res) => {
  try {
    const { ids } = req.body; // Expects an array of IDs in the request body
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No product IDs provided for deletion." });
    }

    // Delete all products whose _id is in the 'ids' array
    const result = await productModel.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No products found to delete with the provided IDs." });
    }

    return res.status(200).json({ message: `${result.deletedCount} products deleted successfully.` });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred during batch deletion", error: error.message });
  }
};


exports.getByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const product = await productModel.find({ category });

    if (product.length === 0)
      return res
        .status(404)
        .json({ message: "No product found in this category", product: [] });
    return res
      .status(200)
      .json({ message: "Product gotten by category", product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const product = await productModel.find();
    return res.status(200).json({ message: "All products", product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};
