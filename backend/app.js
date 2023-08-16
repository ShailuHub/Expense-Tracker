const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const path = require("path");
const sequelize = require("./utils/database");
const expenseRouter = require("./routes/expense");
const userRouter = require("./routes/users");
const app = express();

const User = require("./models/users");
const Expense = require("./models/expenses");

app.use(cors());
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use(userRouter);
app.use(expenseRouter);

User.hasMany(Expense, { foreignKey: "userId" });
Expense.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is working on the port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
