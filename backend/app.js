const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const sequelize = require("./utils/database");
const expenseRouter = require("./routes/expense");
const app = express();

app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(expenseRouter);

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
