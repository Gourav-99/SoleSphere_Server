import Razorpay from "razorpay";

export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZOR_API_ID,
  key_secret: process.env.RAZOR_SECRET_KEY ,
});
