const jwt = require("jsonwebtoken");
const User = require("../models/users");

exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const decToken = jwt.verify(token, process.env.secretKey);
    const user = await User.findOne({ _id: decToken.id });
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
};
