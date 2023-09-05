import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./utils/db.utils";
import cors from "cors";
import logger, { morganMiddleware } from "./logger";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/product";
import paymentRoutes from "./routes/payments";
import orderRoutes from "./routes/order";
// import { createProductsFromJSON } from "./controller/productInsert";
const app = express();

const PORT = process.env.PORT;
connectDB();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morganMiddleware);
app.use("/auth", authRoutes);
app.use("/product", productRoutes);
app.use("/payments", paymentRoutes);
app.use("/order", orderRoutes);
// route for uploading products through json file
// app.get("/pushdata", createProductsFromJSON);
app.post("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  logger.info(`server is runnig at ${PORT}`);
});
