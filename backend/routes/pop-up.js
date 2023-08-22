const express = require("express");
const router = express.Router();
const popUpControllers = require("../controllers/pop-up");

router.get("/pop-up", popUpControllers.getPopUp);

router.get("/pop-up/resetMsg", popUpControllers.getPopUpData);

module.exports = router;
