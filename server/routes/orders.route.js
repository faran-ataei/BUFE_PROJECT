import express from "express";
import { 
  createOrder, 
  getMyOrders, 
  getOrders, 
  updateOrderStatus
} from "../controllers/orders.controller.js";
import { authMiddleware } from "../middleware/authentication.js";

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getOrders);
router.get("/my-orders", authMiddleware, getMyOrders);

router.put("/:id/status", authMiddleware, updateOrderStatus);

export default router;