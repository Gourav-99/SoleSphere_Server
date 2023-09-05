import { Router } from "express";
import {
  checkout,
  updateOrderQty,
  verifyPayment,
} from "../controller/payments";
import { isAuthenticated } from "../middlewares";

const router = Router();
router.post("/checkout", isAuthenticated, checkout);
router.post("/paymentverification", verifyPayment);
router.patch("/productQty", isAuthenticated, updateOrderQty);
export default router;
