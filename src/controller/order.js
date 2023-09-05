import { User } from "../db";
import logger from "../logger";

export const myOrders = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const myOrders = await User.findById(userId).populate({
      path: "myOrders.productId",
      model: "Product",
    });
    console.log(myOrders);
    return res.status(201).json({
      message: "Orders fetched succesfully",
      success: true,
      data: myOrders.myOrders,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
