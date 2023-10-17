const express = require("express");
const router = express.Router();
const expenseControllers = require("../controllers/expenses");
const userAuthentication = require("../middleware/authenticate");

// Route to get the expense page with authentication
router.get(
  "/add-expense",
  userAuthentication.authenticate,
  expenseControllers.getExpensePage
);

//Route to get a single expense for editing with authentication
router.get(
  "/user-expense/edit/:expenseId",
  userAuthentication.authenticate,
  expenseControllers.getSingleExpense
);

// Route to post a new expense with authentication
router.post(
  "/user-expense",
  userAuthentication.authenticate,
  expenseControllers.postExpense
);

// Route to delete an expense with authentication
router.delete(
  "/user-expense/delete/:expenseId",
  userAuthentication.authenticate,
  expenseControllers.deleteExpense
);

// Route to edit an expense with authentication
router.patch(
  "/user-expense/edit/:expenseId",
  userAuthentication.authenticate,
  expenseControllers.editExpense
);

// Route to get expenses for pagination with authentication
router.get(
  "/user-expense/:page/:row",
  userAuthentication.authenticate,
  expenseControllers.getExpensesforPagination
);

module.exports = router;
