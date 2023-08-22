const express = require("express");
const router = express.Router();
const passwordControllers = require("../controllers/password");

router.get(
  "/password/forgotPassword",
  passwordControllers.getForgotPasswordPage
);

router.post("/password/forgotPassword", passwordControllers.postForgotPassword);
router.get(
  `/password/resetpassword/:userId`,
  passwordControllers.getResetPasswordPage
);

router.post(
  `/password/resetpassword/:userId`,
  passwordControllers.postResetPassword
);

module.exports = router;
