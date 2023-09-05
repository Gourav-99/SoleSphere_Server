import fs from "fs";
import logger from "../logger";
import { Product, User } from "../db";
import { log } from "console";
import path from "path";
export const createProductsFromJSON = async (req, res) => {
  try {
    // console.log(path.resolve());
    const rawData = fs.readFileSync(
      `${path.resolve()}/product-data.json`,
      "utf-8"
    );
    const productData = JSON.parse(rawData);
    const createProduct = await Promise.all(
      productData.map(async (productData) => {
        const {
          title,
          subTitle,
          description,
          price,
          tags,
          sizes,
          quantity,
          user,
          image,
        } = productData;
        const product = await Product.create({
          title,
          subTitle,
          description,
          price,
          tags,
          sizes,
          quantity,
          user,
          image,
        });
        await User.findByIdAndUpdate(user, {
          $push: {
            products: product._id,
          },
        });
        return product;
      })
    );
    res.status(201).json({
      message: "Products created successfully from JSON file",
      success: true,
      data: createProduct,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
