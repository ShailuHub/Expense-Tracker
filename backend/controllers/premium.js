const absolutePath = require("../utils/path");
const path = require("path");
const User = require("../models/users");
exports.getLeaderBoard = (req, res, next) => {
  if (req.user.isPremium === true) {
    res.status(201).json({ success: "success", mesage: "User is premium" });
  } else {
    res.status(401).send({ failed: "failed", Message: "Unauthorised" });
  }
};

exports.getLeaderBoardPage = (req, res, next) => {
  res.sendFile(
    path.join(absolutePath, "public", "leaderBoard", "leaderBoard.html")
  );
};

exports.getLeaderBoardList = async (req, res, next) => {
  try {
    const leaderBoardList = await User.findAll({
      attributes: ["username", "totalExpense"],
      order: [["totalExpense", "DESC"]],
    });
    leaderBoardList.map((item, idx) => {
      item.dataValues.idx = idx + 1;
      item.dataValues.username =
        item.dataValues.username.charAt(0).toUpperCase() +
        item.dataValues.username.slice(1);
    });
    console.log(leaderBoardList);
    res.status(201).json(leaderBoardList);
  } catch (error) {
    console.log(error);
  }
};
