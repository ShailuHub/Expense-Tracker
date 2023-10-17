const Expense = require("../models/expenses");
const User = require("../models/users");
const mongoose = require("mongoose");
// const sequelize = require("../utils/database");
const absolutePath = require("../utils/path");
const path = require("path");

// Fetch expenses for pagination
exports.getExpensesforPagination = async (req, res, next) => {
  try {
    const page = Number(req.params.page);
    const row = Number(req.params.row);
    const limit = row;
    const toSkipAfter = (page - 1) * limit;
    const userId = req.user._id;
    const totalExpenses = await Expense.countDocuments({ userId });
    const totalPages = Math.ceil(totalExpenses / limit);
    const expenses = await Expense.find({ userId })
      .skip(toSkipAfter)
      .limit(limit);
    res.json({
      expenses,
      totalPages,
      isPremium: req.user.isPremium,
      currPage: page,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postExpense = async (req, res, next) => {
  const userId = req.user._id;
  const session = await mongoose.startSession();
  session.startTransaction();
  const { amount, description, category } = req.body;
  try {
    // Data validation
    if (
      isNaN(Number(amount)) ||
      Number(amount) <= 0 ||
      !description ||
      !category
    ) {
      return res.status(400).send("Invalid input data");
    }
    const newExpense = new Expense({
      amount,
      description,
      category,
      userId,
    });

    await newExpense.save();
    const totalExpense = Number(req.user.totalExpense) + Number(amount);
    const userExpense = await Expense.find({ userId }).select(["_id"]);
    // Extract _id values from userExpense and assign to req.user.expenses
    const expenses = userExpense.map((expense) => expense._id);
    await User.findByIdAndUpdate(
      userId,
      {
        totalExpense: totalExpense,
        expenses,
      },
      {
        session,
      }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).send("Expense created successfully");
  } catch (err) {
    console.error(err);
    await session.abortTransaction();
    session.endSession();
    res.status(500).send("Internal Server Error");
  }
};

// Delete an expense
exports.deleteExpense = async (req, res, next) => {
  const userId = req.user._id;
  const expenseId = new mongoose.Types.ObjectId(req.params.expenseId);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const expense = await Expense.findOne({ _id: expenseId });
    if (!expense) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).send("Expense not found");
    }
    await expense.deleteOne();
    const totalExpense = Number(req.user.totalExpense) - Number(expense.amount);
    await User.findByIdAndUpdate(
      userId,
      {
        totalExpense: totalExpense,
      },
      {
        session,
      }
    );
    await session.commitTransaction();
    res.status(200).send("Deleted");
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

// Fetch a single expense
exports.getSingleExpense = async (req, res, next) => {
  const expenseId = new mongoose.Types.ObjectId(req.params.expenseId);
  try {
    const expense = await Expense.findOne({ _id: expenseId });
    if (expense) {
      return res.send(expense);
    } else {
      return res.status(404).send("Expense not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

// Edit an expense
exports.editExpense = async (req, res, next) => {
  const expenseId = new mongoose.Types.ObjectId(req.params.expenseId);
  const userId = req.user._id;
  const updatedAmount = req.body.amount;
  const updatedDescription = req.body.description;
  const updatedCategory = req.body.category;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const expense = await Expense.findOne({ _id: expenseId });
    if (!expense) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).send("Expense not found");
    }
    const totalExpense =
      Number(req.user.totalExpense) -
      Number(expense.amount) +
      Number(updatedAmount);
    await User.findByIdAndUpdate(
      userId,
      {
        totalExpense: totalExpense,
      },
      {
        session,
      }
    );
    expense.amount = updatedAmount;
    expense.description = updatedDescription;
    expense.category = updatedCategory;
    await expense.save();
    await session.commitTransaction();
    session.endSession();
    res.status(200).send("Updated");
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    session.endSession();
    res.status(500).send("Internal Server Error");
  }
};

// Serve the expense page if user is premium
exports.getExpensePage = (req, res, next) => {
  if (req.user.isPremium) {
    res.sendFile(path.join(absolutePath, "public", "html", "expense.html"));
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
};
