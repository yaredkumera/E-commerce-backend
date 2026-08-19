import express from "express"
const router = express.Router()
import AuthMiddleware from "../MiddleWare/AuthMiddleware.js"
import sendMessage from "../services/contactFormSubmission.js"

router.post("/contacts",AuthMiddleware ,sendMessage)
export default router