import { Router } from "express";
import {
  adminProduct,
  createProduct,
  editProduct,
  getProduct,
  getProducts,
  removeProduct,
} from "../controller/product";
import { body } from "express-validator";
import { isAuthenticated } from "../middlewares";
import upload from "../utils/uploader.utils";

const router = Router();
router.post(
  "/create-product",

  isAuthenticated,
  upload.single("image"),
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("price").not().notEmpty().isNumeric(),
  body("quantity").notEmpty().isNumeric(),
  body("sizes").notEmpty().withMessage("Sizes are required"),
  createProduct
);
router.get("/adminProduct", isAuthenticated, adminProduct);
router.put(
  "/edit-product/:productId",
  isAuthenticated,

  editProduct
);
router.delete("/delete-product/:productId", isAuthenticated, removeProduct);

router.get("/get-products", getProducts);
router.get("/:productId", getProduct);

export default router;
