const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");
const absolutePath = require("./utils/path");
const cors = require("cors");
const sequelize = require("./utils/database");
const expenseRouter = require("./routes/expense");
const userRouter = require("./routes/users");
const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(userRouter);
app.use(expenseRouter);

app.get("/", (req, res) => {
  res.sendFile(
    path.join(absolutePath, "public", "sign-in-up", "sign_in_up.html")
  );
});
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
