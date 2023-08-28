const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const path = require("path");
const sequelize = require("./utils/database");
const expenseRouter = require("./routes/expense");
const userRouter = require("./routes/users");
const purchaseRouter = require("./routes/purchase");
const preminumRouter = require("./routes/premium");
const passwordRouter = require("./routes/password");
const popUpRouter = require("./routes/pop-up");
const app = express();

const User = require("./models/users");
const Expense = require("./models/expenses");
const Order = require("./models/orders");
const Password = require("./models/forgotPassword");
const Download = require("./models/download");

app.use(cors());
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use(userRouter);
app.use(expenseRouter);
app.use(purchaseRouter);
app.use(preminumRouter);
app.use(passwordRouter);
app.use(popUpRouter);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Password);
Password.belongsTo(User);

User.hasMany(Download);
Download.belongsTo(User);

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
