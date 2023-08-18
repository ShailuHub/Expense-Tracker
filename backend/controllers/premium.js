const absolutePath = require("../utils/path");
const path = require("path");
exports.getLeaderBoard = (req, res, next) => {
  res.sendFile(
    path.join(absolutePath, "public", "leaderBoard", "leaderBoard.html")
  );
};
