const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/users");

// Route to get the login page
router.get("/user/logIn", userControllers.getLoginPage);

// Route to get the expense page
router.get("/expense/addexpense", userControllers.getExpensePage);

// Route to handle user registration
router.post("/user/signUp", userControllers.postUser);

// Route to handle user login
router.post("/user/logIn", userControllers.postCredential);

module.exports = router;
