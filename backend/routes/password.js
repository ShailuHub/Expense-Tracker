const express = require("express");
const router = express.Router();
const passwordControllers = require("../controllers/password");

// Route to get the "Forgot Password" page
router.get(
  "/password/forgotPassword",
  passwordControllers.getForgotPasswordPage
);

// Route to handle the submission of "Forgot Password" form
router.post("/password/forgotPassword", passwordControllers.postForgotPassword);

// Route to get the "Reset Password" page with userId parameter
router.get(
  `/password/resetpassword/:userId`,
  passwordControllers.getResetPasswordPage
);

// Route to handle the submission of "Reset Password" form with userId parameter
router.post(
  `/password/resetpassword/:userId`,
  passwordControllers.postResetPassword
);

module.exports = router;
