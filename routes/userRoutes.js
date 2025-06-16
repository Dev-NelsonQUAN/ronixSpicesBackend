const express = require("express");
const { signUp, login } = require("../controller/user");
const { createOrder } = require("../controller/order");
const { getByCategory, getAllProduct } = require("../controller/product");
const {
  addToCarts,
  removeFromCarts,
  getUserCart,
} = require("../controller/cart");
const { protect } = require("../middleware/authMiddleware");
const userRoutes = express.Router();

userRoutes.post("/signUp", signUp);
userRoutes.post("/login", login);
userRoutes.post("/createOrder", createOrder);
userRoutes.get("/getByCategory", getByCategory);
userRoutes.post("/addToCart", protect, addToCarts);
userRoutes.delete("/removeFromCart", protect, removeFromCarts);
userRoutes.get("/get-cart", protect, getUserCart);
userRoutes.get("/all-product", getAllProduct);

module.exports = userRoutes;
