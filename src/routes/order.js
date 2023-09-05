import { Router } from "express";
import { myOrders } from "../controller/order";
import { isAuthenticated } from "../middlewares";

const router = Router();
router.get("/my-orders", isAuthenticated, myOrders);
export default router;
