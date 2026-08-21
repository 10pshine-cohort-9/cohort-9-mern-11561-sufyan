const express = require("express");
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  updateProfile 
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.put("/profile", protect, upload.single("avatar"), updateProfile);

module.exports = router;