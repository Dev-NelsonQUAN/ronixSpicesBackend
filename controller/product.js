const productModel = require("../model/productModel");

exports.createProduct = async (req, res) => {
  try {
    const { productName, description, price, category } = req.body;
   
    const imagePaths = req.files.map(file => file.path);

    const product = await productModel.create({
      productName,
      description,
      image: imagePaths,
      price,
      category  ,
    });

    if (!productName || !description || !price || !category) {
      return res
        .status(400)
        .json({ message: "All product fields are required." });
    }

    return res.status(201).json({ message: "Product created", product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
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

exports.deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);
    if (!product) return res.status(400).json({ message: "Product not found" });

    return res.status(200).json({ message: "Product Deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
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
        return res.status(200).json({message: "All products", product})
    } catch (error) {
        return res.status(500).json({message: "An error occurred", error: error.message})
    }
}
