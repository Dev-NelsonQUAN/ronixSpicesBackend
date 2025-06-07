const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");

exports.protect = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(400).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );

    const user = await userModel
      .findById(decoded.id || decoded._id)
      .select("-password");
    if (!user) return res.status(400).json({ message: "User not found" });

    req.user = user;
    console.log("User object attached to req:", req.user); // Check what's here!
    
    next();
  } catch (error) {
    res.status(500).json({ message: "Invalid token", error });
  }
};

exports.adminOnly = (req, res, next) => {
  console.log(
    "User role in adminOnly middleware:",
    req.user ? req.user.role : "req.user is undefined"
  );
  if (!req.user || req.user.role != "Admin") {
    return res.status(400).json({ message: "Admins Only, Access denied" });
  }
  next();
};

// exports.adminOnly = (req, res, next) => {
//   if (!req.user || req.user.role != "Admin") {
//     return res.status(400).json({ message: "Admins Only, Access denied" });
//   }
//   next();
// };
