const absolutePath = require("../utils/path");
const path = require("path");
const User = require("../models/users");
const Expense = require("../models/expenses");
const Download = require("../models/download");
const premiumServices = require("../services/premiumServices");

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
    const leaderBoardList = await User.find(
      {},
      { username: 1, totalExpense: 1 }
    )
      .sort({ totalExpense: -1 })
      .exec();
    const modifiedLeaderBoardList = leaderBoardList.map((user, idx) => {
      return {
        username:
          user.username.charAt(0).toUpperCase() + user.username.slice(1),
        totalExpense: Number(user.totalExpense),
        idx: idx + 1,
      };
    });
    res.status(201).json(modifiedLeaderBoardList);
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

exports.getExpenseDetail = async (req, res, next) => {
  try {
    if (req.user.isPremium) {
      const searchType = req.params.searchType;
      const inputDate = new Date(req.params.date);
      let dateFilter = {};
      if (searchType === "date") {
        dateFilter = {
          createdAt: {
            $gte: new Date(
              inputDate.getFullYear(),
              inputDate.getMonth(),
              inputDate.getDate()
            ),
            $lt: new Date(
              inputDate.getFullYear(),
              inputDate.getMonth(),
              inputDate.getDate() + 1
            ),
          },
        };
      } else if (searchType === "month") {
        dateFilter = {
          createdAt: {
            $gte: new Date(inputDate.getFullYear(), inputDate.getMonth(), 1),
            $lt: new Date(inputDate.getFullYear(), inputDate.getMonth() + 1, 1),
          },
        };
      }

      const expenseDetail = await Expense.find({
        userId: req.user.id,
        ...dateFilter,
      });

      if (expenseDetail.length > 0) {
        const totalSum = expenseDetail.reduce(
          (total, expense) => total + expense.amount,
          0
        );
        res.send({ success: "success", expenseArray: expenseDetail, totalSum });
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
  const userId = req.user._id;
  const username = req.user.username;
  try {
    const expenses = await Expense.find(userId);
    const stringifyExpenses = JSON.stringify(expenses);
    const fileName = `expense-${username}/${new Date()}.txt`;
    const fileUrl = await premiumServices.uploadToS3(
      stringifyExpenses,
      fileName
    );
    const download = new Download({
      file: fileUrl,
      userId: userId,
    });
    await download.save();
    await res.status(200).json({ fileUrl, success: "success" });
  } catch (error) {
    res
      .status(500)
      .json({ success: "failed", message: "Internal server error" });
  }
};

exports.getDownloadUrl = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const downloadRecords = await Download.find(userId);
    // Construct a list of download URLs
    const downloadURLs = downloadRecords.map((record) => record.file);

    const fileName = `Expense-File-${downloadURLs.length}`;
    res.status(200).json({ downloadURLs, fileName, success: "success" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: "failed", message: "Intenal server error" });
  }
};
