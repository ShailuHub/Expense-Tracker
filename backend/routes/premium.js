const express = require("express");
const router = express.Router();
const authenticateControllers = require("../middleware/authenticate");
const premiumControllers = require("../controllers/premium");

router.get(
  "/premium",
  authenticateControllers.authenticate,
  premiumControllers.getLeaderBoard
);

router.get("/premium/leaderboard", premiumControllers.getLeaderBoardPage);

router.get("/premium/leaderboardList", premiumControllers.getLeaderBoardList);

module.exports = router;
