import Razorpay from "razorpay";

export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZOR_API_ID || "rzp_test_ZJR987VqztLENX",
  key_secret: process.env.RAZOR_SECRET_KEY || "PvIdba6P6p1wCeT5nGIJaQSX",
});
