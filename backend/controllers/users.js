const User = require("../models/users");

exports.postUser = async (req, res, next) => {
  let { username, email, password, confirm_password } = req.body;
  username = username.trim().toLowerCase();
  email = email.trim().toLowerCase();
  if (password === confirm_password) {
    try {
      const isEmail = await User.findOne({ where: { email: email } });
      if (isEmail) res.status(300).send({ message: "User already exists!!" });
      else {
        try {
          await User.create({
            username,
            email,
            password,
          });
          res.status(201).send({ message: "Successfully created" });
        } catch (error) {
          res.status(500).send({ message: "Internal server error" });
        }
      }
    } catch (error) {
      res.status(500).send({ message: "Internal server error" });
    }
  } else {
    res.status(301).send({
      message: "Oops!! Entered password doesn't match with Confirm password",
    });
  }
};

exports.postCredential = (req, res, next) => {
  const { email, password } = req.body;
  res.status(201).send({ email, password });
};
