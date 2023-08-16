const User = require("../models/users");
const bcrypt = require("bcrypt");
const path = require("path");
const absolutePath = require("../utils/path");

const saltRounds = 10;

//Posting new users details to database
exports.postUser = async (req, res, next) => {
  const { username, email, password, confirm_password } = req.body;
  const trimmedUsername = username.trim().toLowerCase();
  const trimmedEmail = email.trim().toLowerCase();

  if (password === confirm_password) {
    try {
      const isEmailUsed = await User.findOne({
        where: { email: trimmedEmail },
      });
      if (isEmailUsed) {
        return res.status(409).json({ message: "User already exists" });
      }
      const hashPassword = await bcrypt.hash(password, saltRounds);
      try {
        await User.create({
          username: trimmedUsername,
          email: trimmedEmail,
          password: hashPassword,
        });
        return res.status(201).json({ message: "User created successfully" });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(400).json({ message: "Passwords don't match" });
  }
};

//Posting data to the database to check for login in purpose
exports.postCredential = async (req, res, next) => {
  const { email, password } = req.body;
  const trimmedEmail = email.trim().toLowerCase();
  try {
    const isEmail = await User.findOne({ where: { email: trimmedEmail } });
    if (!isEmail) res.status(404).send({ message: "User doesn't exists!!" });
    else {
      const isMatch = await bcrypt.compare(password, isEmail.password);
      if (isMatch) {
        res.send("success");
      } else {
        res.send("failed");
      }
    }
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.getExpensePage = (req, res, next) => {
  res.sendFile(path.join(absolutePath, "public", "expense", "expense.html"));
};

exports.getLoginPage = (req, res, next) => {
  res.sendFile(
    path.join(absolutePath, "public", "sign-in-up", "sign_in_up.html")
  );
};
