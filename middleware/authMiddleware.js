const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel');


const protect = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(400).json({message: "Unauthorized"})

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id || decoded._id).select('-password')
        if (!user) return res.status(400).json({message: "User not found"})
        
        req.user = user;
        next()
    } catch (error) {
        res.status(500).json({message: "Invalid token", error})
    }
}

exports.adminOnly = (req, res, next) => {
    if (!req.user || req.user.role != "Admin") {
        return res.status(400).json({message : "Admins Only, Access denied"})
    }
    next()
}