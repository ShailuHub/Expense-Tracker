const express = require("express");
const router = express.Router();
const expenseControllers = require("../controllers/expenses");

router.get("/user-expense", expenseControllers.getExpense);
router.get(
  "/user-expense/edit/:expenseId",
  expenseControllers.getSingleExpense
);
router.post("/user-expense", expenseControllers.postExpense);
router.delete(
  "/user-expense/delete/:expenseId",
  expenseControllers.deleteExpense
);
router.patch("/user-expense/edit/:expenseId", expenseControllers.editExpense);
module.exports = router;
