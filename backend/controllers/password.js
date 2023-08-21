const path = require("path");
const aboslutePath = require("../utils/path");
exports.getForgotPasswordPage = (req, res, next) => {
  res.sendFile(
    path.join(aboslutePath, "public", "forgotPassword", "forgotPassword.html")
  );
};

exports.postForgotPassword = (req, res, next) => {
  console.log(req.body);
  res.send("<h1>Posted</h1>");
};
