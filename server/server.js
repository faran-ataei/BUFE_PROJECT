import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";

// Routes
import usersRoutes from "./routes/users.route.js";
import productsRoutes from "./routes/products.route.js";
import ordersRoutes from "./routes/orders.route.js";

const app = express();

// Middleware setup
app.use(express.json()); // JSON body parse
app.use(express.urlencoded({ extended: true })); // form-data parse (opsiyonel ama bırakabilirsin)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // cookie gönderimine izin verir
  })
);
app.use(cookieParser()); // cookie parse

// Routes
app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);

const port = process.env.PORT || 5000;

// Server start
const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(port, () => {
      console.log(`✅ Server is running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Server start error:", err);
  }
};

start();