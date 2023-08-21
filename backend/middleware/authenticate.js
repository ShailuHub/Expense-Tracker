const jwt = require("jsonwebtoken");
const User = require("../models/users");

exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization;
  console.log(req.headers);
  try {
    const decToken = await jwt.verify(token, process.env.secretKey);
    const user = await User.findOne({ where: { id: decToken.id } });
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
};
