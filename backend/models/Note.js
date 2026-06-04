// Import mongoose
const mongoose = require("mongoose");

// Create Note Schema
const noteSchema = new mongoose.Schema(
  {
    // Reference to the user who owns this note
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Note title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Main note content
    content: {
      type: String,
      required: true,
      trim: true,
    },

    // Used to pin important notes at the top
    isPinned: {
      type: Boolean,
      default: false,
    },
  },

  // Automatically adds:
  // createdAt
  // updatedAt
  {
    timestamps: true,
  }
);

// Create and export Note model
module.exports = mongoose.model("Note", noteSchema);