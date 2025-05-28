const productModel = require("../model/productModel");



exports.createProduct = async (req, res) => {
    try {
        const { productName, description, price, category} = req.body;
        if (!req.file || !req.file.path) return res.status(400).json({message: "Image upload failed"});

        const product = await productModel.create({
            productName,
            description,
            image: req.file.path,
            price, 
            category,
        })
        return res.status(200).json({message: "product created", product})
    } catch (error) {
        return res.status(500).json({message: "An error occurred", error: error.message})
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const {productName, description, price, category} = req.body;
        const product = await productModel.findById(req.params.id)

        if (!product) return res.status(400).json({message: "Product not not found"})
        
        product.productName = productName || product.productName;
        product.price = price || product.price;
        product.category = category || product.category;
        product.description = description || product.description;

        if (req.file?.path) product.image = req.file.path;

        const updated = await product.save()
        return res.status(200).json({message: " Producted updated", updated})
    } catch {
        return res.status(500).json({message: "An error occurred", error: error. message})
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const product = await productModel.findByIdAndDelete(req.params.id)
        if(!product) return res.status(400).json({message: "Product not found"})

        return res.status(200).json({message: "Deleted successfully"})
    } catch (error) {
        return res.status(500).json({message: "An error occurred", error: error.message})
    }
}

exports.getByCategory = async (req, res) => {
    try {
        const {category} = req.params;
        const product = await productModel.find({ category });

        if (product.length === 0) return res.status(400).json({message: "No product found in this category"});
        return res.status(200).json({message: "Product by category", product})
    } catch (error) {
        return res.status(500).json({message: "An error occurred", error: error.message})
    }
}