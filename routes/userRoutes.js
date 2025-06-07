const express = require('express')
const { signUp, login } = require('../controller/user')
const { createOrder } = require('../controller/order')
const { getByCategory } = require('../controller/product')
const { addToCarts, removeFromCarts } = require('../controller/cart')
const userRoutes = express.Router()

userRoutes.post('/signUp', signUp)
userRoutes.post('/login', login)
userRoutes.post('/createOrder', createOrder)
userRoutes.get('/getByCategory', getByCategory)
userRoutes.post('/addToCart', addToCarts)
userRoutes.delete('/removeFromCart', removeFromCarts)

module.exports = userRoutes