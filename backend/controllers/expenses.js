const Expense = require("../models/expenses");
const User = require("../models/users");
const sequelize = require("../utils/database");
const absolutePath = require("../utils/path");
const path = require("path");

// Fetch expenses for pagination
exports.getExpensesforPagination = async (req, res, next) => {
  try {
    const page = req.params.page;
    const row = req.params.row;
    console.log(page, row);
    const limit = Number(row);
    const toSkipAfter = (page - 1) * limit;
    const totalExpenses = await Expense.count({
      where: { userId: req.user.id },
    });
    const totalPages = Math.ceil(totalExpenses / limit);
    const expenses = await Expense.findAll({
      where: { userId: req.user.id },
      offset: toSkipAfter,
      limit: limit,
    });

    res.json({
      expenses: expenses,
      totalPages: totalPages,
      isPremium: req.user.isPremium,
      currPage: page,
    });
  } catch (err) {
    console.log(err);
  }
};

// Create a new expense
exports.postExpense = async (req, res, next) => {
  const userId = req.user.id;
  const t = await sequelize.transaction();
  const { amount, description, category } = req.body;
  try {
    await Expense.create(
      {
        amount,
        description,
        category,
        userId,
      },
      { transaction: t }
    );
    req.user.totalExpense = Number(req.user.totalExpense) + Number(amount);

    await User.update(
      {
        totalExpense: req.user.totalExpense,
      },
      {
        where: { id: userId },
        transaction: t,
      }
    );
    await t.commit();
    res.status(201).send("Table created");
  } catch (err) {
    console.log(err);
    await t.rollback();
    res.status(500).send("Internal Server Error");
  }
};

// Delete an expense
exports.deleteExpense = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  const t = await sequelize.transaction();
  try {
    const expense = await Expense.findOne({ where: { id: expenseId } });
    if (expense) {
      await expense.destroy({ transaction: t });
      req.user.totalExpense =
        Number(req.user.totalExpense) - Number(expense.amount);
      await User.update(
        {
          totalExpense: req.user.totalExpense,
        },
        {
          where: { id: req.user.id },
          transaction: t,
        }
      );
      await t.commit();
      res.status(200).send("Deleted");
    } else {
      res.status(404).send("Expense not found");
    }
  } catch (err) {
    await t.rollback();
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

// Fetch a single expense
exports.getSingleExpense = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  try {
    const expense = await Expense.findOne({ where: { id: expenseId } });
    if (expense) {
      res.send(expense);
    } else {
      res.status(404).send("Expense not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

// Edit an expense
exports.editExpense = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  const updatedAmount = req.body.amount;
  const updatedDescription = req.body.description;
  const updatedCategory = req.body.category;
  const t = await sequelize.transaction();
  try {
    const expense = await Expense.findOne({ where: { id: expenseId } });
    if (expense) {
      req.user.totalExpense =
        Number(req.user.totalExpense) -
        Number(expense.amount) +
        Number(updatedAmount);
      await User.update(
        {
          totalExpense: req.user.totalExpense,
        },
        {
          where: { id: req.user.id },
          transaction: t,
        }
      );
      expense.amount = updatedAmount;
      expense.description = updatedDescription;
      expense.category = updatedCategory;
      await expense.save({ transaction: t });
      await t.commit();
      res.status(200).send("Updated");
    } else {
      res.status(404).send("Expense not found");
    }
  } catch (err) {
    console.log(err);
    await t.rollback();
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
