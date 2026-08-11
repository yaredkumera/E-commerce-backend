import express from "express"
import AuthMiddleware from "../MiddleWare/AuthMiddleware.js"
import AdminMiddleware from "../MiddleWare/AdminMiddleware.js"
import { getAllUsers, updateUserRole } from "../controllers/userController.js"

const router = express.Router()
router.use(AuthMiddleware, AdminMiddleware)
router.get("/users", getAllUsers)
router.put("/users/:id/role", updateUserRole)

export default router