const path = require("path");
const aboslutePath = require("../utils/path");
const nodemailer = require("nodemailer");
const User = require("../models/users");
const Password = require("../models/forgotPassword");
const bcrypt = require("bcrypt");
const sequelize = require("../utils/database");
const saltRounds = 10;

exports.getForgotPasswordPage = (req, res, next) => {
  res.sendFile(
    path.join(aboslutePath, "public", "forgotPassword", "forgotPassword.html")
  );
};

exports.getResetPasswordPage = (req, res, next) => {
  res.sendFile(
    path.join(aboslutePath, "public", "updatePassword", "updatePassword.html")
  );
};

exports.postResetPassword = async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const userId = req.params.userId;

  const t = await sequelize.transaction();
  try {
    const user = await Password.findOne({
      where: { id: userId },
      transaction: t,
    });
    if (!user)
      return res
        .status(401)
        .send({ success: "failed", message: "Email not found" });

    if (user && password === confirmPassword && user.isActive == true) {
      const hashPassword = await bcrypt.hash(password, saltRounds);
      await User.update(
        { password: hashPassword },
        { where: { id: user.userId }, transaction: t }
      );
      user.isActive = false;
      await user.save({ transaction: t });
      await t.commit();
      return res
        .status(200)
        .send({ success: "success", message: "Password reset successfully" });
    } else {
      return res
        .status(400)
        .send({ success: "failed", message: "Passwords do not match" });
    }
  } catch (error) {
    console.log(error);
    await t.rollback();
    return res
      .status(500)
      .send({ success: "failed", message: "An error occurred" });
  }
};

exports.postForgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({
      where: { email: email.trim().toLowerCase() },
    });
    if (user) {
      // Create a Nodemailer transporter
      const findUser = await Password.findOne({ where: { userId: user.id } });
      await findUser.update({
        isActive: true,
      });
      const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.mailtrap_username,
          pass: process.env.mailtrap_password,
        },
      });
      // Define email content
      const mailOptions = {
        from: "shailesh.respond@gmail.com",
        to: email,
        subject: "Reset Password",
        html: `<p>Click the link to reset password <a href="http://localhost:3000/password/resetpassword/${findUser.id}">Reset Password</a></p>`,
      };

      // Send the email
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log(info);
        res.status(201).send({
          success: "success",
          message: "Email has been sent",
          userId: findUser.id,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      res.status(401).send({ message: "User not Found" });
    }
  } catch (error) {
    console.log(error);
  }
};
