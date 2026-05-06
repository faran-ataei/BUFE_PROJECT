import express from "express";
import { createOrder, getOrders } from "../controllers/orders.controller.js";
import { authMiddleware } from "../middleware/authentication.js";


const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getOrders);

export default router;
