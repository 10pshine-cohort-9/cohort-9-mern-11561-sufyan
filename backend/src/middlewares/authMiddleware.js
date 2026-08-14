const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  // Check if the authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token (Format is usually "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID and attach them to the request object (excluding the password hash)
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Move on to the next middleware or the controller
    } catch (error) {
      res.status(401);
      next(new Error("Not authorized, token failed or expired"));
    }
  }

  if (!token) {
    res.status(401);
    next(new Error("Not authorized, no token provided"));
  }
};

module.exports = { protect };