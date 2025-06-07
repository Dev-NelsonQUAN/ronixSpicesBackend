const cartModel = require("../model/cartModel");

exports.createOrder = async (req, res) => {
  try {
    const cart = await cartModel
      .findOne({ user: req.user._id })
      .populate("items.product");

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    let totalAmount = 0;

    for (const item of cart.items) {
      totalAmount += item.product.price * item.qty;
      await item.product.save();
    }
    const order = new orderModel({
      user: req.user._id,
      items: cart.items.map((i) => ({
        product: i.product._id,
        qty: i.qty,
      })),
      totalAmount,
    });

    await order.save();

    await cartModel.findOneAndDelete({ user: req.user._id });
    
    return res
      .status(200)
      .json({ message: "Order placed successfully", order });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "An error occurred", error: error.message });
  }
};
