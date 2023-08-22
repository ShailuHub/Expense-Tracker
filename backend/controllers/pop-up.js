const path = require("path");
const aboslutePath = require("../utils/path");

const onResetData = {
  heading: "Thank You",
  message: "A reset password link has sent to email",
};

exports.getPopUp = (req, res, next) => {
  res.sendFile(
    path.join(aboslutePath, "public", "pop-up-card", "pop-card.html")
  );
};

exports.getPopUpData = (req, res, next) => {
  res.json(onResetData);
};
