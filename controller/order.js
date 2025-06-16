const cartModel = require("../model/cartModel");
const orderModel = require("../model/orderModel");
const mongoose = require("mongoose");


exports.createOrder = async (req, res) => {
  try {
    const cart = await cartModel
      .findOne({ user: req.user._id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) { 
      return res.status(400).json({ message: "Cart is empty" });
    }
    let totalAmount = 0;

    for (const item of cart.items) {
      if (!item.product || typeof item.product.price !== 'number') {
        console.warn(`Product ID ${item.product?._id || item.product} missing or has invalid price.`);
        continue;
      }
      totalAmount += item.product.price * item.qty;
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
    console.error("Error creating order:", error);
    return res
      .status(500) 
      .json({ message: "An error occurred while placing the order", error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find()
      .populate('user', 'name email avatar') 
      .populate('items.product', 'productName price image'); 

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found." });
    }

    return res.status(200).json({ message: "All orders fetched successfully", orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return res.status(500).json({ message: "An error occurred while fetching orders", error: error.message });
  }
};


exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID format." });
    }

    const order = await orderModel.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    const allowedStatuses = ['pending', 'processing', 'delivered', 'cancelled'];
    if (status && !allowedStatuses.includes(status)) {
       return res.status(400).json({ message: "Invalid status value provided." });
    }

    order.status = status || order.status;

    const updatedOrder = await order.save();

    return res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json({ message: "An error occurred while updating the order", error: error.message });
  }
};