const express = require("express");
const {
  createProduct,
  updateProduct,
  getAllProduct,
  deleteMultipleProducts,
  getByCategory,
} = require("../controller/product");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { adminSignUp, adminLogin } = require("../controller/admin");
const upload = require("../utils/upload");
const adminRouter = express.Router();

adminRouter.post("/signUp", adminSignUp);
adminRouter.post("/login", adminLogin);
adminRouter.post("/createProduct", protect, adminOnly, upload.single('productImage'), createProduct);
adminRouter.patch("/updateProduct/:id", adminOnly, updateProduct);
adminRouter.delete("/deleteProducts", protect, adminOnly, deleteMultipleProducts);
adminRouter.get('/getAllProduct', protect, adminOnly, getAllProduct)
adminRouter.get('/getByCategory', protect, adminOnly, getByCategory )

module.exports = adminRouter;