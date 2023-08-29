const absolutePath = require("../utils/path");
const path = require("path");
const User = require("../models/users");
const Expense = require("../models/expenses");
const Download = require("../models/download");
const premiumServices = require("../services/premiumServices");
// const AWS = require("aws-sdk");

// Get leader board data (API endpoint)
exports.getLeaderBoard = (req, res, next) => {
  if (req.user.isPremium === true) {
    res.status(201).json({ success: "success", message: "User is premium" });
  } else {
    res.status(401).send({ failed: "failed", message: "Unauthorised" });
  }
};

// Serve the leader board HTML page
exports.getLeaderBoardPage = (req, res, next) => {
  res
    .status(200)
    .sendFile(path.join(absolutePath, "public", "html", "leaderBoard.html"));
};

// Get and send the leader board list (API endpoint)
exports.getLeaderBoardList = async (req, res, next) => {
  try {
    const leaderBoardList = await User.findAll({
      attributes: ["username", "totalExpense"],
      order: [["totalExpense", "DESC"]],
    });
    leaderBoardList.map((item, idx) => {
      item.dataValues.idx = idx + 1;
      item.dataValues.username =
        item.dataValues.username.charAt(0).toUpperCase() +
        item.dataValues.username.slice(1);
    });
    res.status(201).json(leaderBoardList);
  } catch (error) {
    console.log(error);
  }
};

// Check if user is premium, then serve premium features page (API endpoint)
exports.getPremiumFeaturesPage = async (req, res, next) => {
  try {
    if (req.user.isPremium) {
      res
        .status(201)
        .send({ success: "success", message: "User is authorised user" });
    } else {
      res.status(401).send({ success: "failed", message: "Unauthorised user" });
    }
  } catch (error) {
    console.log(error);
  }
};

// Serve the premium features page
exports.showPremiumFeaturesPage = async (req, res, next) => {
  res.sendFile(path.join(absolutePath, "public", "html", "report.html"));
};

// Handle posting date for search (API endpoint)
exports.postDate = async (req, res, next) => {
  const { date, month, searchType } = req.body;
  res.status(201).send({
    date: date,
    month: month,
    searchType: searchType,
    success: "success",
    message: "Post received",
  });
};

// Get expense details based on search date/type (API endpoint)
exports.getExpenseDetail = async (req, res, next) => {
  try {
    if (req.user.isPremium) {
      const expenseDetail = await Expense.findAll({
        where: {
          userId: req.user.id,
        },
      });

      // Get search parameters
      const searchType = req.params.searchType;
      const inputDate = new Date(req.params.date);
      const expenseArray = [];
      let totalSum = 0;

      // Filter expenses based on search criteria
      expenseDetail.forEach((expense) => {
        const createdDate = new Date(expense.createdAt);
        if (
          (searchType === "date" &&
            createdDate.getDate() === inputDate.getDate() &&
            createdDate.getMonth() + 1 === inputDate.getMonth() + 1 &&
            createdDate.getFullYear() === inputDate.getFullYear()) ||
          (searchType === "month" &&
            createdDate.getMonth() + 1 === inputDate.getMonth() + 1 &&
            createdDate.getFullYear() === inputDate.getFullYear())
        ) {
          expenseArray.push(expense);
          totalSum += expense.amount;
        }
      });

      if (expenseArray.length > 0) {
        res.send({ success: "success", expenseArray, totalSum });
      } else {
        res.send({
          success: "failed",
          message: "No expenses found for the given date.",
        });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "An error occurred" });
  }
};

exports.downloadExpense = async (req, res, next) => {
  try {
    const expenses = await req.user.getExpenses();
    const stringifyExpenses = JSON.stringify(expenses);
    const fileName = `expense-${req.user.id}/${new Date()}.txt`;
    const fileUrl = await premiumServices.uploadToS3(
      stringifyExpenses,
      fileName
    );
    await Download.create({
      file: fileUrl,
      userId: req.user.id,
    });
    await res.status(200).json({ fileUrl, success: "success" });
  } catch (error) {
    res
      .status(500)
      .json({ success: "failed", message: "Internal server error" });
  }
};

// // data and the name of the file to be stored in aws
// function uploadToS3(data, filename) {
//   const bucketName = "trackyourexpense007";
//   const iAmUser = process.env.I_AM_USER;
//   const iAmUserSecretKey = process.env.I_AM_USER_KEY;
//   //create an object which talk with aws s3 which has all the authentication key;
//   const awsObj = new AWS.S3({
//     accessKeyId: iAmUser,
//     secretAccessKey: iAmUserSecretKey,
//   });

//   //create parameters object to cnnect with which bucket file name to save
//   const params = {
//     Bucket: bucketName,
//     Key: filename,
//     Body: data,
//     //ACL access control level
//     ACL: "public-read",
//   };
//   return new Promise((resolve, reject) => {
//     awsObj.upload(params, (err, s3response) => {
//       if (err) {
//         console.log(err);
//         reject(err);
//       } else {
//         resolve(s3response.Location);
//       }
//     });
//   });
// }

exports.getDownloadUrl = async (req, res, next) => {
  try {
    const downloadURL = await req.user.getDownloads();
    const fileName = `Expense-File-${downloadURL.length}`;
    res.status(200).json({ downloadURL, fileName, success: "success" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: "failed", message: "Intenal server error" });
  }
};
