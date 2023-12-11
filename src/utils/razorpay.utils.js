import Razorpay from "razorpay";

export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZOR_API_ID || "rzp_test_M08pbaHX8ZXrUY",
  key_secret: process.env.RAZOR_SECRET_KEY || "rzp_test_M08pbaHX8ZXrUY",
});
