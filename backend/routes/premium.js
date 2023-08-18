const express = require("express");
const router = express.Router();
const premiumControllers = require("../controllers/premium");
router.get("/premium/leaderboard", premiumControllers.getLeaderBoard);

module.exports = router;
