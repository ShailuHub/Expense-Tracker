// const Sequelize = require("sequelize");
// const sequelize = require("../utils/database");

// const Order = sequelize.define("order", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: true,
//     primaryKey: true,
//   },
//   paymentId: Sequelize.STRING,
//   orderId: Sequelize.STRING,
//   status: Sequelize.STRING,
// });

// module.exports = Order;

const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
  },
  status: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Order", orderSchema);
