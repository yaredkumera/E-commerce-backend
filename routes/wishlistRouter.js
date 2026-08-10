import express from "express"
import AuthMiddleware from "../MiddleWare/AuthMiddleware.js"
import { getWishlist, addToWishlist, removeFromWishlist } from "../controllers/whishlistController.js"

const router = express.Router()

router.use(AuthMiddleware) // every wishlist route requires a logged-in user

router.get("/wishlist", getWishlist)
router.post("/wishlist", addToWishlist)
router.delete("/wishlist/:id", removeFromWishlist)

export default router