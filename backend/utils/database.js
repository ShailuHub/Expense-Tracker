// const dotenv = require("dotenv");
// dotenv.config();
// const Sequelize = require("sequelize");
// const sequelize = new Sequelize(
//   "expense_tracker",
//   process.env.DB_Username,
//   process.env.DB_Password,
//   {
//     host: process.env.HOST,
//     dialect: "mysql",
//   }
// );

// module.exports = sequelize;

const mongodb = require("mongodb");
const mongoose = require("mongoose");

const mongoConnection = async (connect) => {
  await mongoose.connect(
    `mongodb+srv://${process.env.Db_Username}:${process.env.Db_Password}@cluster0.qtu98rs.mongodb.net/`
  );
  console.log("Connected to mongodb");
  connect();
};

module.exports = mongoConnection;
