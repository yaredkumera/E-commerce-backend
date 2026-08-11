import express from "express"
import AuthMiddleware from "../MiddleWare/AuthMiddleware.js"
import AdminMiddleware from "../MiddleWare/AdminMiddleware.js"
import { createProduct, updateProduct, deleteProduct, getProducts } from "../controllers/productController.js"

const router = express.Router()

router.get("/products", getProducts)

router.post("/products", AuthMiddleware, AdminMiddleware,createProduct)
router.put("/products/:id", AuthMiddleware,  AdminMiddleware,updateProduct)
router.delete("/products/:id", AuthMiddleware,  AdminMiddleware,deleteProduct)

export default router