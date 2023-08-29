const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const sequelize = require("./utils/database");
const expenseRouter = require("./routes/expense");
const userRouter = require("./routes/users");
const purchaseRouter = require("./routes/purchase");
const path = require("path");
const fs = require("fs");
const preminumRouter = require("./routes/premium");
const passwordRouter = require("./routes/password");
const popUpRouter = require("./routes/pop-up");
const PORT = process.env.PORT || 3000;

const morgan = require("morgan");

const app = express();

const User = require("./models/users");
const Expense = require("./models/expenses");
const Order = require("./models/orders");
const Password = require("./models/forgotPassword");
const Download = require("./models/download");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(cors());
app.use(express.static("public"));
app.use(morgan("combined", { stream: accessLogStream }));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use(userRouter);
app.use(expenseRouter);
app.use(purchaseRouter);
app.use(preminumRouter);
app.use(passwordRouter);
app.use(popUpRouter);
app.use((req, res) => {
  res.send(path.join(__dirname, `public/${req.url}`));
});

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
    app.listen(PORT, () => {
      console.log(`Server is working on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
