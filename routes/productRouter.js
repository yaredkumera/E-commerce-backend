import express from "express"
import AuthMiddleware from "../MiddleWare/AuthMiddleware.js"
import { createProduct, updateProduct, deleteProduct, getProducts } from "../controllers/productController.js"

const router = express.Router()

router.get("/products", getProducts)

router.post("/products", AuthMiddleware, createProduct)
router.put("/products/:id", AuthMiddleware, updateProduct)
router.delete("/products/:id", AuthMiddleware, deleteProduct)

export default router