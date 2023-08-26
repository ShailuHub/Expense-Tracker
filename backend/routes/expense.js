const express = require("express");
const router = express.Router();
const expenseControllers = require("../controllers/expenses");
const userAuthentication = require("../middleware/authenticate");

router.get(
  "/add-expense",
  userAuthentication.authenticate,
  expenseControllers.getExpensePage
);

// router.get(
//   "/user-expense",
//   userAuthentication.authenticate,
//   expenseControllers.getExpense
// );
router.get(
  "/user-expense/edit/:expenseId",
  userAuthentication.authenticate,
  expenseControllers.getSingleExpense
);
router.post(
  "/user-expense",
  userAuthentication.authenticate,
  expenseControllers.postExpense
);
router.delete(
  "/user-expense/delete/:expenseId",
  userAuthentication.authenticate,
  expenseControllers.deleteExpense
);
router.patch(
  "/user-expense/edit/:expenseId",
  userAuthentication.authenticate,
  expenseControllers.editExpense
);

router.get(
  "/user-expense/:page/:row",
  userAuthentication.authenticate,
  expenseControllers.getExpensesforPagination
);

module.exports = router;
