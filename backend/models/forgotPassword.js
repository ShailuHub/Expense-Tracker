// const Sequelize = require("sequelize");
// const sequelize = require("../utils/database");
// const { v4: uuidv4 } = require("uuid");

// const Password = sequelize.define("forgotPasswordRequest", {
//   id: {
//     type: Sequelize.UUID,
//     defaultValue: () => uuidv4(),
//     primaryKey: true,
//   },
//   isActive: {
//     type: Sequelize.BOOLEAN,
//     defaultValue: false,
//   },
// });

// module.exports = Password;

const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Password", forgotPasswordSchema);
