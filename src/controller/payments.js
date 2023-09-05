import { Order, Product, User } from "../db";
import logger from "../logger";
import { razorpayInstance } from "../utils/razorpay.utils";
import crypto from "crypto";
export const checkout = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount,
      currency: "INR",
    };
    const razorpayOrder = await razorpayInstance.orders.create(options);
    console.log(razorpayOrder);
    return res.status(201).json({
      message: "RazorPay Order created successfully",
      success: true,
      data: razorpayOrder,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZOR_SECRET_KEY || "PvIdba6P6p1wCeT5nGIJaQSX"
      )
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        message: "payment failed",
        success: false,
      });
    }
    await Order.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.redirect(`http://localhost:3000/paymentsuccess/${razorpay_order_id}`);
    res
      .status(201)
      .json({ message: "order Placed successfully", success: true });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const updateOrderQty = async (req, res) => {
  try {
    const { OrderedProducts } = req.body;
    const { id: userId } = req.user;
    const productOrders = [];
    console.log(OrderedProducts);
    for (const productId in OrderedProducts) {
      productOrders.push({
        productId: productId,
        orderedQuantity: OrderedProducts[productId].selectedQuantity,
        orderedSize: OrderedProducts[productId].activeSize,
      });
    }
    console.log(productOrders);
    // Assuming you have a User model
    await User.updateOne(
      { _id: userId },
      {
        $push: {
          myOrders: { $each: productOrders },
        },
      }
    );

    // Iterate over the product IDs and update their quantities
    for (const productId in OrderedProducts) {
      const selectedQuantity = OrderedProducts[productId].selectedQuantity;

      // Find and update the product quantity in the database
      await Product.updateOne(
        { _id: productId },
        { $inc: { quantity: -selectedQuantity } } // Decrement the quantity
      );
    }

    return res
      .status(200)
      .json({ message: "Updated successfully", success: true });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
