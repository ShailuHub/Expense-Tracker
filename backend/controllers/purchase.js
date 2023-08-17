const RazorPay = require("razorpay");

const razorPay = new RazorPay({
  key_id: process.env.pay_keyId,
  key_secret: process.env.pay_secretKey,
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
    res.status(201).json({ order, key_id: razorPay.key_id });
  } catch (error) {
    console.log(error);
  }
};
