const absolutePath = require("../utils/path");
const path = require("path");
const User = require("../models/users");
const Expense = require("../models/expenses");

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
        const createdDate = expense.createdAt;
        if (
          (searchType === "date" &&
            createdDate.getDate() === inputDate.getDate() &&
            createdDate.getMonth() === inputDate.getMonth() &&
            createdDate.getFullYear() === inputDate.getFullYear()) ||
          (searchType === "month" &&
            createdDate.getMonth() === inputDate.getMonth() &&
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
