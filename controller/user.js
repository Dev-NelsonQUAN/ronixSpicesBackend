const userModel = require("../model/userModel");

const bcrypt = require('bcrypt');
const generateToken = require("../utils/generate");



exports.signUp = async (req, res) => {
    try {
        const {fullName, email, password, phoneNumber} = req.body;
        
        if (!fullName, !email, !password, !phoneNumber) return res.status(400).json({message: "All fields required"})

        const checkEmail = await userModel.findOne({ email })
        if (checkEmail) return res.status(400).json({message: "User already exists"});

        const hashPassword = await bcrypt.hash(password, 10)
        const user = await userModel.create({
            fullName,
            email,
            password: hashPassword,
            phoneNumber,
        })
        return res.status(200).json({message: "User created successfully", user})
    } catch (error) {
        return res.status(500).json({message: "An error occurred", error: error.message})
    }
}


exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await userModel.findOne({email});
        if (!user) return res.status(400).json({message: "User not found"})

        const isMatch = bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({message: "Incorrect password"})
        
        const token = generateToken(user._id, user.role)

        return res.status(200).json({message: "login successful", user, token})
    } catch (error) {
        return res.status(500).json({message: "An error occurred", error: error.message})
    }
}