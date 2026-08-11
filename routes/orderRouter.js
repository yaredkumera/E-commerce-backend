import express from "express"
import AuthMiddleware from "../MiddleWare/AuthMiddleware.js"
import AdminMiddleware from "../MiddleWare/AdminMiddleware.js"
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from "../controllers/orderController.js"

const router = express.Router()

router.use(AuthMiddleware)

router.post("/orders", createOrder)
router.get("/orders", getMyOrders)
router.get("/orders/all", AdminMiddleware, getAllOrders)
router.put("/orders/:id/status", AdminMiddleware, updateOrderStatus)

export default router