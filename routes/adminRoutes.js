const express = require("express");
const adminRouter = express.Router();

const {
  createProduct,
  updateProduct,
  deleteMultipleProducts,
  getByCategory,
  getAllProducts,
} = require("../controller/product");

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controller/category");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const { adminSignUp, adminLogin } = require("../controller/admin");
const upload = require("../utils/upload");
const { getAllOrders, updateOrder } = require("../controller/order");
const { getAllUsers } = require("../controller/user");

adminRouter.post("/signUp", adminSignUp);
adminRouter.post("/login", adminLogin);

adminRouter.post(
  "/createProduct",
  protect,
  adminOnly,
  upload.single("productImage"),
  createProduct
);
adminRouter.patch("/updateProduct/:id", protect, adminOnly, updateProduct);
adminRouter.delete(
  "/deleteProducts",
  protect,
  adminOnly,
  deleteMultipleProducts
);
adminRouter.get("/getAllProducts", protect, adminOnly, getAllProducts);
adminRouter.get("/getByCategory", protect, adminOnly, getByCategory);

adminRouter.post("/categories", protect, adminOnly, createCategory);
adminRouter.get("/categories", protect, adminOnly, getAllCategories);
adminRouter.get("/categories/:id", protect, adminOnly, getCategoryById);
adminRouter.put("/categories/:id", protect, adminOnly, updateCategory);
adminRouter.delete("/categories/:id", protect, adminOnly, deleteCategory);

adminRouter.get("/getAllOrders", protect, adminOnly, getAllOrders);
adminRouter.patch("/updateOrder/:id", protect, adminOnly, updateOrder);
adminRouter.get('/getAllUsers', protect, adminOnly, getAllUsers)

module.exports = adminRouter;
