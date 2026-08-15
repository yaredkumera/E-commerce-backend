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

   
    if (paymentMethod === "cod") {
      for (const item of cartItems) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { stock: -item.quantity },
        })
      }
      await Cart.deleteMany({ user: req.user.id })
    }

    res.status(201).json({ success: true, message: "Order placed successfully", data: order })
  } catch (err) {
  console.error("CREATE ORDER ERROR:", err);

  res.status(400).json({
    success: false,
    message: err.message || "Could not create order",
  });
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

async function getOneOrder(req, res) {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id })
    if (!order) {
      return res.status(404).json({ success: false, message: "order not found" })
    }
    res.status(200).json({ success: true, message: "Order fetched successfully", data: order })
  } catch (err) {
    res.status(400).json({ success: false, message: "something went wrong" })
  }
}

async function getAllOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 })

    res.status(200).json({ success: true, message: "All orders fetched successfully", data: orders })
  } catch (err) {
    res.status(500).json({ success: false, message: "something went wrong" })
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )

    if (!order) {
      return res.status(404).json({ success: false, message: "order not found" })
    }

    res.status(200).json({ success: true, message: "Order status updated", data: order })
  } catch (err) {
    res.status(400).json({ success: false, message: "something went wrong" })
  }
}

export { createOrder, getMyOrders, getOneOrder, getAllOrders, updateOrderStatus }
