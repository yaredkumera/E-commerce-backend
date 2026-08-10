import express from "express"
import AuthMiddleware from "../MiddleWare/AuthMiddleware.js"
import { createOrder, getMyOrders } from "../controllers/orderController.js"

const router = express.Router()

router.use(AuthMiddleware)

router.post("/orders", createOrder)
router.get("/orders", getMyOrders)

export default router