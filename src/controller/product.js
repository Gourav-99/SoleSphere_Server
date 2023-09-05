import { validationResult } from "express-validator";
import { Product, User } from "../db";
import logger from "../logger";
// adimin route
export const createProduct = async (req, res) => {
  try {
    if (req.user.role !== 1) {
      return res.status(404).json({
        message: "Unauthorised to create product",
        success: false,
      });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        success: false,
        data: errors.array(),
      });
    }
    const user = req.user.id;
    let { title, subTitle, description, price, tags, sizes, quantity } =
      req.body;
    const { location: image } = req.file;
    if (!image) {
      return res.status(400).json({
        message: "please provide image",
        success: false,
      });
    }
    const product = await Product.create({
      title,
      subTitle,
      description,
      image,
      price,
      tags,
      sizes,
      quantity,
      user,
    });
    // adding product to user's product list
    const updateUserList = await User.findByIdAndUpdate(user, {
      $push: {
        products: product._id,
      },
    });
    return res.status(201).json({
      message: "Product created succesfully",
      success: true,
      data: product,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
export const editProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { id: userId } = req.user;
    const product = await Product.findOne({ _id: productId, user: userId });
    if (!product) {
      return res.status(404).json({
        message: "Product not found or unauthorized to edit",
        success: false,
      });
    }
    const { title, subTitle, description, price, tags, sizes, quantity } =
      req.body;
    let image;
    if (req.file.location) {
      image = req.file.location;
      product.image = image;
    }

    for (const field in req.body) {
      // Check if the field exists in the Product schema
      if (field in product) {
        product[field] = req.body[field];
      }
    }

    await product.save();
    return res.status(200).json({
      message: "Product updated successfully",
      success: true,
      data: product,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const removeProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { id: userId } = req.user;
    const product = await Product.findOne({ _id: productId, user: userId });
    if (!product) {
      return res.status(404).json({
        message: "Product not found or unauthorized to edit",
        success: false,
      });
    }
    // removes product for  products collection
    await Product.findByIdAndRemove(productId);
    // removes product from users collection
    await User.findByIdAndUpdate(userId, {
      $pull: {
        products: productId,
      },
    });
    return res.status(200).json({
      message: "Product removed successfully",
      success: true,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
// gets all the products in collection
export const getProducts = async (req, res) => {
  try {
    const { _search } = req.query;

    console.log(_search && _search !== "undefined" && _search.length > 0);
    if (
      typeof _search !== "undefined" &&
      _search !== "undefined" &&
      _search.length > 0
    ) {
      const products = await Product.find({
        title: { $regex: _search, $options: "i" },
      })
        .populate({
          path: "user",
          select: "fName lName _id email bussiness",
        })
        .sort({ createdAt: -1 });
      console.log(products);
      return res.status(201).json({
        message: "fetched products",
        success: true,
        data: products,
      });
    }
    const products = await Product.find()
      .populate({
        path: "user",
        select: "fName lName _id email bussiness",
      })
      .sort({ createdAt: -1 });

    return res.status(201).json({
      message: "fetched products",
      success: true,
      data: products,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
// fetch paricular product
export const getProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log(productId);
    const product = await Product.findById(productId).populate({
      path: "user",
      select: "fName lName _id email bussiness",
    });
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }
    return res.status(201).json({
      message: "Product fetched successfully",
      success: true,
      data: product,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Internal Server error",
      success: false,
    });
  }
};
