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

router.get(
  "/premium/leaderboardList",
  authenticateControllers.authenticate,
  premiumControllers.getLeaderBoardList
);

router.get("/premium/features", premiumControllers.showPremiumFeaturesPage);
router.post("/premium/features/report", premiumControllers.postDate);

router.get(
  "/premium/features/report/:searchType/:date",
  authenticateControllers.authenticate,
  premiumControllers.getExpenseDetail
);

module.exports = router;
