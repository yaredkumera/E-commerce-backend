import express from 'express'
const router=express.Router()
import signup from '../controllers/signUpController.js'
router.post('/signup',signup)
export default router