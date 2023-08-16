const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/users");

router.get("/user/logIn", userControllers.getLoginPage);
router.get("/expense/addexpense", userControllers.getExpensePage);
router.post("/user/signUp", userControllers.postUser);
router.post("/user/logIn", userControllers.postCredential);

module.exports = router;
