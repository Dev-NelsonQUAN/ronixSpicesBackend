const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generate");

exports.adminSignUp = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber } = req.body;

    const checkAdmin = await userModel.findOne({ email });

    if (checkAdmin) {
      return res.status(400).json({ message: "Email already exist" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const createAdmin = await userModel.create({
      fullName,
      email,
      password: hashPassword,
      phoneNumber,
      role: "Admin",
    });

    await createAdmin.save();

    return res.status(201).json({ message: "Admin created successfully", data: createAdmin });

  } catch (err) {
    return res.status(500).json({ message: "Server error", err });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await userModel.findOne({ email });

    if (!admin) {
      return res.status(404).json({ messasge: "Admin not found" });
    }

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const comparePassword = await bcrypt.compare(password, admin.password);

    if (!comparePassword) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    const token = generateToken(admin._id, admin.role);

    return res
      .status(200)
      .json({ message: "Admin Login Successful", data: admin, token: token });
  } catch (err) {
    return res.status(500).json({ meessage: "Server Error", error: err.message });
  }
};
