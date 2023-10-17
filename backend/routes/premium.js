const express = require("express");
const router = express.Router();
const authenticateControllers = require("../middleware/authenticate");
const premiumControllers = require("../controllers/premium");

// Route to get the premium leaderboard with authentication
router.get(
  "/premium",
  authenticateControllers.authenticate,
  premiumControllers.getLeaderBoard
);

// Route to get the premium leaderboard page
router.get("/premium/leaderboard", premiumControllers.getLeaderBoardPage);

// Route to get the premium leaderboard list with authentication
router.get(
  "/premium/leaderboardList",
  authenticateControllers.authenticate,
  premiumControllers.getLeaderBoardList
);

// Route to get the premium features page
router.get("/premium/features", premiumControllers.showPremiumFeaturesPage);

// Route to post premium feature report
router.post("/premium/features/report", premiumControllers.postDate);

// Route to get expense detail based on search type and date with authentication
router.get(
  "/premium/features/report/:searchType/:date",
  authenticateControllers.authenticate,
  premiumControllers.getExpenseDetail
);

//Route to initiate expense download with authentication
router.get(
  "/download",
  authenticateControllers.authenticate,
  premiumControllers.downloadExpense
);

//Route to get the download URL with authentication
router.get(
  "/download/url",
  authenticateControllers.authenticate,
  premiumControllers.getDownloadUrl
);

module.exports = router;
