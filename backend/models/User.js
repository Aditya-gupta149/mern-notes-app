// Import mongoose
const mongoose = require("mongoose");

// Create User Schema
const userSchema = new mongoose.Schema(
  {
    // User's display name
    username: {
      type: String,
      required: true,
      trim: true,
    },

    // User email (must be unique)
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    // Hashed password
    password: {
      type: String,
      required: true,
    },
  },

  // Automatically adds:
  // createdAt
  // updatedAt
  {
    timestamps: true,
  }
);

// Create and export User model
module.exports = mongoose.model("User", userSchema);