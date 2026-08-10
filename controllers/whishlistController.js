// controllers/wishlistController.js
import Wishlist from "../models/wishlistModel.js"
import Product from "../models/productModel.js"

async function getWishlist(req, res) {
  try {
    const wishlist = await Wishlist.find({ user: req.user.id }).populate('product')
    res.status(200).json({
      success: true,
      message: "Wishlist fetched successfully",
      data: wishlist,
    })
  } catch (err) {
    res.status(500).json({ success: false, message: "something went wrong" })
  }
}

async function addToWishlist(req, res) {
  try {
    const { productId } = req.body

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ success: false, message: "product not found" })
    }

    const existing = await Wishlist.findOne({ user: req.user.id, product: productId })
    if (existing) {
      return res.status(409).json({ success: false, message: "already in wishlist" })
    }

    const newItem = await Wishlist.create({ user: req.user.id, product: productId })
    const populated = await newItem.populate('product')

    res.status(201).json({
      success: true,
      message: "Added to wishlist",
      data: populated,
    })
  } catch (err) {
    res.status(400).json({ success: false, message: "something went wrong" })
  }
}

async function removeFromWishlist(req, res) {
  try {
    const productId = req.params.id

    const deleted = await Wishlist.findOneAndDelete({ user: req.user.id, product: productId })

    if (!deleted) {
      return res.status(404).json({ success: false, message: "item not found in wishlist" })
    }

    res.status(200).json({
      success: true,
      message: "Removed from wishlist",
      data: deleted,
    })
  } catch (err) {
    res.status(400).json({ success: false, message: "something went wrong" })
  }
}

export { getWishlist, addToWishlist, removeFromWishlist }