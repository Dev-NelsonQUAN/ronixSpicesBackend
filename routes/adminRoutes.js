const express = require("express");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
} = require("../controller/product");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { adminSignUp, adminLogin } = require("../controller/admin");
const upload = require("../utils/upload");
const adminRouter = express.Router();

adminRouter.post("/signUp", adminSignUp);
adminRouter.post("/login", adminLogin);
adminRouter.post("/createProduct", protect, adminOnly, upload.single('productImage'), createProduct);
adminRouter.patch("/updateProduct", adminOnly, updateProduct);
adminRouter.delete("/deleteProduct", adminOnly, deleteProduct);
adminRouter.get('/getAllProduct', getAllProduct)

module.exports = adminRouter;