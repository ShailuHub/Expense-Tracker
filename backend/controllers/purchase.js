const RazorPay = require("razorpay");
const User = require("../models/users");
const Order = require("../models/orders");
const razorPay = new RazorPay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_KEY,
});

exports.purchaseMemberShip = async (req, res, next) => {
  const userId = req.user._id;
  try {
    //create an order Id
    const razorPayOrder = await razorPay.orders.create({
      amount: 5000,
      currency: "INR",
    });
    const order = new Order({
      orderId: razorPayOrder.id,
      status: "PENDING",
      userId: userId,
    });
    await order.save();
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
  const userId = req.user._id;
  try {
    if (payment_id) {
      await Order.findByIdAndUpdate(userId, {
        status: "DONE",
        paymentId: payment_id,
        orderId: order_id,
      });
      await User.findByIdAndUpdate(userId, { isPremium: true });
    }
    res
      .status(201)
      .json({ success: "success", message: "Payment done by this user" });
  } catch (error) {
    console.log(error);
  }
};
