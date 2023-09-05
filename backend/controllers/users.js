const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const absolutePath = require("../utils/path");
const Password = require("../models/forgotPassword");
const sequelize = require("../utils/database");

const saltRounds = 10;

//Posting new users details to database
exports.postUser = async (req, res, next) => {
  //get all details
  const { username, email, password, confirm_password } = req.body;
  const trimmedUsername = username.trim().toLowerCase();
  const trimmedEmail = email.trim().toLowerCase();

  //Initialise transaction
  const t = await sequelize.transaction();

  //check for password and confirm password
  if (password === confirm_password) {
    try {
      //find any email exists
      const isEmailUsed = await User.findOne({
        where: { email: trimmedEmail },
        transaction: t,
      });

      //if email exists
      if (isEmailUsed) {
        return res.status(409).json({ message: "User already exists" });
      }

      //if email does not exists
      const hashPassword = await bcrypt.hash(password, saltRounds);

      //try to save it in database
      try {
        //store details in user table
        const user = await User.create(
          {
            username: trimmedUsername,
            email: trimmedEmail,
            password: hashPassword,
          },
          { transaction: t }
        );

        //store the users password
        await Password.create(
          {
            userId: user.id,
          },
          { transaction: t }
        );
        await t.commit();
        return res.status(201).json({ message: "User created successfully" });
      } catch (error) {
        console.error(error);
        await t.rollback();
        return res.status(500).json({ message: "Internal server error" });
      }
    } catch (error) {
      console.error(error);
      await t.rollback();
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(400).json({ message: "Passwords don't match" });
  }
};

//Posting data to the database to check for login in purpose
exports.postCredential = async (req, res, next) => {
  //get the details
  const { email, password } = req.body;
  const trimmedEmail = email.trim().toLowerCase();
  try {
    const isEmail = await User.findOne({ where: { email: trimmedEmail } });
    if (!isEmail) res.status(404).send({ message: "User doesn't exists!!" });
    else {
      const isMatch = await bcrypt.compare(password, isEmail.password);
      //if email exits and password matched create a token for that user and allow to enter in app
      if (isMatch) {
        //creation of token
        const createToken = await jwt.sign(
          { id: isEmail.id, email: isEmail.email, isPremium: null },
          process.env.secretKey,
          { expiresIn: "1h" }
        );
        res.status(201).json({
          success: "success",
          message: "User has suceesfully logged in",
          token: createToken,
        });
      } else {
        res.status(404).send({ message: "User doesn't exists!!" });
      }
    }
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

exports.getExpensePage = (req, res, next) => {
  res.sendFile(path.join(absolutePath, "public", "html", "expense.html"));
};

exports.getLoginPage = (req, res, next) => {
  res.sendFile(path.join(absolutePath, "public", "html", "sign_in_up.html"));
};
