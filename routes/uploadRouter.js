import express from "express"
import AuthMiddleware from "../MiddleWare/AuthMiddleware.js"
import AdminMiddleware from "../MiddleWare/AdminMiddleware.js"
import upload from "../MiddleWare/uploadMiddleware.js"
import { uploadImage } from "../controllers/uploadController.js"

const router = express.Router()

router.post("/upload", AuthMiddleware, AdminMiddleware, upload.single('image'), uploadImage)

export default router