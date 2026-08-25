const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Associates the note with a specific User document
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please provide a note title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Please provide note content"],
      // Rich text will be stored as an HTML string, so no max length is enforced
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Note", noteSchema);