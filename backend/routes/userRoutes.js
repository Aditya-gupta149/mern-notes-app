const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { signupUser, loginUser, getProfile } = require("../controllers/userController");

const router = express.Router();
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);

module.exports = router;