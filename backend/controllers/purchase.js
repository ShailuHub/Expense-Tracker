const RazorPay = require("razorpay");
const User = require("../models/users");
const Order = require("../models/orders");
const razorPay = new RazorPay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_KEY,
});

exports.purchaseMemberShip = async (req, res, next) => {
  try {
    const razorPayOrder = await razorPay.orders.create({
      amount: 5000,
      currency: "INR",
    });
    const order = await req.user.createOrder({
      orderId: razorPayOrder.id,
      status: "PENDING",
    });

    res.status(201).json({
      order,
      key_id: razorPay.key_id,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.purchaseStatus = async (req, res, next) => {
  const { order_id, payment_id } = req.body;
  try {
    if (payment_id) {
      const order = await Order.findOne({ where: { userId: req.user.id } });
      order.status = "DONE";
      order.paymentId = payment_id;
      order.orderId = order_id;
      await order.save();
      const user = await User.findOne({ where: { id: req.user.id } });
      user.isPremium = true;
      await user.save();
    }
    res
      .status(201)
      .json({ success: "success", message: "Payment done by this user" });
  } catch (error) {
    console.log(error);
  }
};
