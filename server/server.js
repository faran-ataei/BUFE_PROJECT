import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import { createServer } from "http"; 
import { Server } from "socket.io";   

// Routes
import usersRoutes from "./routes/users.route.js";
import productsRoutes from "./routes/products.route.js";
import ordersRoutes from "./routes/orders.route.js";

const app = express();
const httpServer = createServer(app); 

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

app.set("socketio", io);

io.on("connection", (socket) => {
  console.log(`📡 Bir kullanıcı bağlandı: ${socket.id}`);
  
  socket.on("disconnect", () => {
    console.log("❌ Kullanıcı ayrıldı");
  });
});

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

// Routes
app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);

const port = process.env.PORT || 5050;

// Server start
const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    
    httpServer.listen(port, () => {
      console.log(`✅ Server is running at http://localhost:${port}`);
      console.log(`🚀 Socket.io is ready for real-time orders`);
    });
  } catch (err) {
    console.error("❌ Server start error:", err);
  }
};

start();