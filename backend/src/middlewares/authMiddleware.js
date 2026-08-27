const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        res.status(401);
        const err = new Error("Not authorized, user no longer exists");
        return next(err);
      }
      req.user = user;
      return next();
    } catch (error) {
      res.status(401);
      return next(new Error("Not authorized, token failed or expired"));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error("Not authorized, no token provided"));
  }
};

module.exports = { protect };