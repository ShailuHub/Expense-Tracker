const express = require("express");
const router = express.Router();
const purchaseControllers = require("../controllers/purchase");
const authenticateControllers = require("../middleware/authenticate");

// Route to purchase a membership with authentication
router.get(
  "/purchase/membership",
  authenticateControllers.authenticate,
  purchaseControllers.purchaseMemberShip
);

// Route to update transaction status with authentication
router.post(
  "/purchase/updateTransactionstatus",
  authenticateControllers.authenticate,
  purchaseControllers.purchaseStatus
);

module.exports = router;
