import { Router } from "express";
import { body } from "express-validator";
import {
  forgotPassword,
  loadUser,
  resetPassword,
  signIn,
  signUp,
} from "../controller/auth";
import upload from "../utils/uploader.utils";
const router = Router();
router.get("/validate/:token", loadUser);
router.post(
  "/signup",
  body("password").trim().isLength({ min: 6 }),
  body("fName").trim().not().isEmpty(),
  body("lName").trim().not().isEmpty(),
  upload.single("file"),
  signUp
);
router.post("/signin", body("password").trim().isLength({ min: 6 }), signIn);
router.post("/forgot-password", forgotPassword);
router.post(
  "/reset-password/:token",
  body("password").trim().isLength({ min: 6 }),
  resetPassword
);
export default router;
