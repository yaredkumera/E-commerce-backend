import Cart from "../models/cartModel.js"
import Product from "../models/productModel.js"

async function getCarts(req, res) {
  try {
    const cart = await Cart.find({ user: req.user.id }).populate('product')
    res.status(200).json({ success: true, message: "Cart fetched successfully", data: cart })
  } catch (err) {
    res.status(500).json({ success: false, message: "something went wrong" })
  }
}

async function createCart(req, res) {
  try {
    const { productId } = req.body

    const existingItem = await Cart.findOne({ user: req.user.id, product: productId })
    if (existingItem) {
      return res.status(409).json({ success: false, message: "already exist" })
    }


    const newItem = await Cart.create({ user: req.user.id, product: productId, quantity:1 })
    const populated = await newItem.populate('product')

    res.status(201).json({ success: true, message: "Added to cart", data: populated })
  } catch (err) {
    res.status(400).json({ success: false, message: "something went wrong" })
  }
}

async function updateCart(req, res) {
  try {
    const id = req.params.id
    const item = await Cart.findOne({ _id: id, user: req.user.id }).populate('product')

    if (!item) {
      return res.status(404).json({ success: false, message: "item not found" })
    }

    if (req.body.quantity > item.product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${item.product.stock} in stock`,
      })
    }

    item.quantity = req.body.quantity
    const updated = await item.save()

    res.status(200).json({ success: true, message: "Cart updated", data: updated })
  } catch (err) {
    res.status(400).json({ success: false, message: "something went wrong" })
  }
}

async function deleteCart(req, res) {
  try {
    const id = req.params.id
    const deleted = await Cart.findOneAndDelete({ _id: id, user: req.user.id })

    if (!deleted) {
      return res.status(404).json({ success: false, message: "item not found" })
    }

    res.status(200).json({ success: true, message: "item removed", data: deleted })
  } catch (err) {
    res.status(400).json({ success: false, message: "something went wrong" })
  }
}

export { getCarts, createCart, updateCart, deleteCart }