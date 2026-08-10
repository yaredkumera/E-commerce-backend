import Order from "../models/orderModel.js"
import Cart from "../models/cartModel.js"
import Product from "../models/productModel.js"

async function createOrder(req, res) {
  try {
    const { firstName, streetAddress, townCity, phoneNumber, email, paymentMethod } = req.body

    const cartItems = await Cart.find({ user: req.user.id }).populate('product')

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" })
    }

    for (const item of cartItems) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${item.product.stock} left for ${item.product.name}`,
        })
      }
    }

    const items = cartItems.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }))

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const order = await Order.create({
      user: req.user.id,
      items,
      firstName,
      streetAddress,
      townCity,
      phoneNumber,
      email,
      paymentMethod,
      total,
    })

    for (const item of cartItems) {
        
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      })

    }

    await Cart.deleteMany({ user: req.user.id })

    res.status(201).json({ success: true, message: "Order placed successfully", data: order })
  } catch (err) {
    res.status(400).json({ success: false, message: "something went wrong" })
  }
}

async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.status(200).json({ success: true, message: "Orders fetched successfully", data: orders })
  } catch (err) {
    res.status(500).json({ success: false, message: "something went wrong" })
  }
}

export { createOrder, getMyOrders }