const jwt = require("jsonwebtoken");
const User = require("../models/users");

exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization;
  const user = await jwt.verify(token, process.env.secretKey);
  req.userId = user.id;
  console.log(user.id);
  next();
  // try {
  //   const userVerifiedToken = await jwt.verify(token, process.env.secretKey);
  //   const user = await User.findOne({ where: { id: userVerifiedToken.id } });
  //   req.user = user;
  //   next();
  // } catch (error) {
  //   console.log(error);
  // }
};
