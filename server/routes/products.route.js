import {Router} from 'express';
import { authMiddleware } from '../middleware/authentication.js';
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../controllers/product.controller.js';

const router = Router();

// get all products
router.get("/", getAllProducts)

// get product by id
router.get("/:id", getProductById)

// create product
router.post("/", authMiddleware, createProduct)

// update product
router.put("/:id", authMiddleware, updateProduct)

// delete product
router.delete("/:id", authMiddleware, deleteProduct)


export default router;