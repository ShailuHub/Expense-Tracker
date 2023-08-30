const path = require("path");
const aboslutePath = require("../utils/path");
const nodemailer = require("nodemailer");
const User = require("../models/users");
const Password = require("../models/forgotPassword");
const bcrypt = require("bcrypt");
const sequelize = require("../utils/database");
const saltRounds = 10;

// Serve the forgot password page
exports.getForgotPasswordPage = (req, res, next) => {
  res.sendFile(
    path.join(aboslutePath, "public", "html", "forgotPassword.html")
  );
};

// Serve the reset password page
exports.getResetPasswordPage = (req, res, next) => {
  res.sendFile(
    path.join(aboslutePath, "public", "html", "updatePassword.html")
  );
};

// Handle the reset password request
exports.postResetPassword = async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  const userId = req.params.userId;

  // Start a transaction for database operations
  const t = await sequelize.transaction();
  try {
    // Find the password reset entry for the provided userId
    const user = await Password.findOne({
      where: { id: userId },
      transaction: t,
    });

    // Handle case when the user is not found
    if (!user) {
      await t.rollback();
      return res
        .status(401)
        .send({ success: "failed", message: "Email not found" });
    }

    // Check if passwords match and user is active
    if (password !== confirmPassword || !user.isActive) {
      await t.rollback();
      return res
        .status(400)
        .send({ success: "failed", message: "Passwords do not match" });
    }

    // Hash the new password and update the user's password
    const hashPassword = await bcrypt.hash(password, saltRounds);
    await User.update(
      { password: hashPassword },
      { where: { id: user.userId }, transaction: t }
    );

    // Deactivate the password reset entry
    user.isActive = false;
    await user.save({ transaction: t });

    // Commit the transaction
    await t.commit();
    return res
      .status(200)
      .send({ success: "success", message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    await t.rollback();
    return res
      .status(500)
      .send({ success: "failed", message: "An error occurred" });
  }
};

// Handle the forgot password request
exports.postForgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Find the user associated with the provided email
    const user = await User.findOne({
      where: { email: email.trim().toLowerCase() },
    });

    // Handle case when the user is not found
    if (!user) {
      return res.status(401).send({ message: "User not Found" });
    }

    // Activate the password reset entry
    const findUser = await Password.findOne({ where: { userId: user.id } });
    await findUser.update({ isActive: true });

    // Create a Nodemailer transporter
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
      html: `<p>Click the link to reset password <a href="http://3.109.64.14:3000/password/resetpassword/${findUser.id}">Reset Password</a></p>`,
    };

    // Send the email
    try {
      const info = await transporter.sendMail(mailOptions);
      res.status(201).send({
        success: "success",
        message: "Email has been sent",
        userId: findUser.id,
      });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: "failed", message: "An error occurred" });
  }
};
