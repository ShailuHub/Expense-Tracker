const express = require("express");
const router = express.Router();
const passwordControllers = require("../controllers/password");

router.get(
  "/password/forgotPassword",
  passwordControllers.getForgotPasswordPage
);

router.post("/password/forgotPassword", passwordControllers.postForgotPassword);

module.exports = router;
