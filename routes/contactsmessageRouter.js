import express from "express"
const router = express.Router()
import AuthMiddleware from "../MiddleWare/AuthMiddleware.js"
import sendMessage from "../services/contactFormSubmission.js"
router.use(AuthMiddleware)

router.post("/contacts", sendMessage)
export default router