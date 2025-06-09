const cartModel = require("../model/cartModel");
const productModel = require("../model/productModel");

exports.addToCarts = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const product = await productModel.findById(productId);
    if (!product) return res.status(400).json({ message: "Product not found" });

    let cart = await cartModel({ user: req.user._id });
    if (!cart) {
      cart = new cartModel({
        user: req.user._id,
        items: [{ product: productId, qty }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId.toString()
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].qty += qty;
      } else {
        cart.items.push({ product: productId, qty });
      }
    }
    await cart.save();

    return res.status(200).json({ message: "Added to cart", cart });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

exports.removeFromCarts = async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await cartModel.findOne({ user: req.user._id });

    if (!cart) return res.status(400).json({ message: "Cart not found" });
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

        if (itemIndex > -1) {
            cart.items.splice(itemIndex, 1)
            await cart.save();
            return res.status(200).json({message: "Removed from cart", cart})
        } else {
            return res.status(400).json({message: "Product not found in cart"})
        }
    } catch (error) {
        return res.status(500).json({message: "An error occurred", error: error.message})
    }
} 

exports.getUserCart = async (req, res) => {
    try{
        const userId = req.user._id;
        const cart = await cartModel.findOne({ user: userId}).populate("items")
        if (!cart) return res.status(400).json({message: "Cart not found"})
        
        return res.status(200).json({message: "Cart gotten", cart})
    } catch (error) {
        return res.status(500).json({message: "An error occurred", error: error.message})
    }
}