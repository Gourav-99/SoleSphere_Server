import { Router } from "express";
import {
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

  body("title").not().isEmpty(),
  body("description").not().isEmpty(),

  body("quantity").not().isEmpty(),
  isAuthenticated,
  upload.single("image"),
  createProduct
);
router.put(
  "/edit-product/:productId",
  isAuthenticated,
  upload.single("image"),
  editProduct
);
router.delete("/delete-product", isAuthenticated, removeProduct);
// for all users unprotected routes
router.get("/get-products", getProducts);
router.get("/:productId", getProduct);

export default router;
