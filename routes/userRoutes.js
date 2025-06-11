const express = require('express')
const { signUp, login } = require('../controller/user')
const { createOrder } = require('../controller/order')
const { getByCategory, getAllProduct, createProduct, updateProduct, deleteProduct } = require('../controller/product')
const { addToCarts, removeFromCarts, getUserCart } = require('../controller/cart')
const { protect, adminOnly } = require('../middleware/authMiddleware')
const upload = require('../utils/upload')
const userRoutes = express.Router()

userRoutes.post('/signUp', signUp)
userRoutes.post('/login', login)
userRoutes.post('/createOrder', createOrder)
userRoutes.get('/getByCategory', getByCategory)
userRoutes.post('/addToCart', addToCarts)
userRoutes.delete('/removeFromCart', removeFromCarts)
userRoutes.get('/get-cart', protect, getUserCart)
userRoutes.get('all-product', getAllProduct)
userRoutes.post("/create-product", upload.array('images', 5), protect, adminOnly, createProduct)
userRoutes.put("/update-product/:id", upload.array('image', 5),protect, adminOnly, updateProduct)
userRoutes.delete("/delete-product/:id", protect, adminOnly, deleteProduct)


module.exports = userRoutes