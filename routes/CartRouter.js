import express from 'express'
import AuthMiddleware from '../MiddleWare/AuthMiddleware.js'
import { getCarts, createCart, updateCart, deleteCart } from '../controllers/cartController.js'

const router = express.Router()

router.use(AuthMiddleware) 
router.get('/cart', getCarts)
router.post('/cart', createCart)
router.put('/cart/:id', updateCart)
router.delete('/cart/:id', deleteCart)

export default router