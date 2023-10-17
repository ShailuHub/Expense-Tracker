const mongoose = require("mongoose");

const downloadSchema = new mongoose.Schema(
  {
    file: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Download", downloadSchema);
