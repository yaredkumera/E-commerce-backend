import express from "express"
import { ForgotPass, ResetPass } from "../services/forgotPassword.js"

const router = express.Router()

router.post("/forgot-password", ForgotPass)
router.post("/reset-password/:resetPasswordToken", ResetPass)

export default router