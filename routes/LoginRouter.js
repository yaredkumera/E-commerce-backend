import express from 'express'
const router=express.Router()
import LoginController from '../controllers/LoginController.js'
router.post('/login',LoginController)
export default router