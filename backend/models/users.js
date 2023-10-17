const mongoose = require("mongoose");
const Download = require("../models/download.js");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  totalExpense: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0.0,
  },
  expenses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense", // Reference the 'Expense' model
    },
  ],
  downloads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Download",
    },
  ],
  orders: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  passwords: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Password",
  },
});

module.exports = mongoose.model("User", userSchema);
