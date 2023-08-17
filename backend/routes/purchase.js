const express = require("express");
const router = express.Router();
const purchaseControllers = require("../controllers/purchase");
const authenticateControllers = require("../middleware/authenticate");

router.get(
  "/purchase/membership",
  authenticateControllers.authenticate,
  purchaseControllers.purchaseMemberShip
);

router.post(
  "/purchase/updateTransactionstatus",
  authenticateControllers.authenticate,
  purchaseControllers.purchaseMemberShip
);

module.exports = router;
