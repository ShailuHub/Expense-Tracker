const Expense = require("../models/expenses");

exports.getExpense = async (req, res, next) => {
  try {
    const expenseDetail = await Expense.findAll();
    res.send(expenseDetail);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.postExpense = async (req, res, next) => {
  const { amount, description, category } = req.body;
  try {
    await Expense.create({
      amount,
      description,
      category,
    });
    res.status(201).send("Table created");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

exports.deleteExpense = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  try {
    const expense = await Expense.findOne({ where: { id: expenseId } });
    if (expense) {
      await expense.destroy();
      res.status(200).send("Deleted");
    } else {
      res.status(404).send("Expense not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

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

exports.editExpense = async (req, res, next) => {
  const expenseId = req.params.expenseId;
  const updatedAmount = req.body.amount;
  const updatedDescription = req.body.description;
  const updatedCategory = req.body.category;
  try {
    const expense = await Expense.findOne({ where: { id: expenseId } });
    if (expense) {
      expense.amount = updatedAmount;
      expense.description = updatedDescription;
      expense.category = updatedCategory;
      await expense.save();
      res.status(200).send("Updated");
    } else {
      res.status(404).send("Expense not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};
