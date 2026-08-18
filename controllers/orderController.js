import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

async function createOrder(req, res) {
  try {
    const {
      firstName,
      streetAddress,
      townCity,
      phoneNumber,
      email,
      paymentMethod,
    } = req.body;

    const cartItems = await Cart.find({
      user: req.user.id,
    }).populate("product");

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    for (const item of cartItems) {
      if (!item.product) {
        return res.status(400).json({
          success: false,
          message: "A product in your cart no longer exists",
        });
      }

      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${item.product.stock} left for ${item.product.name}`,
        });
      }
    }

    const items = cartItems.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const total = items.reduce(
      (sum, item) =>
        sum + item.price * item.quantity,
      0
    );

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
    });


    if (paymentMethod === "cod") {
      for (const item of cartItems) {
        await Product.findByIdAndUpdate(
          item.product._id,
          {
            $inc: {
              stock: -item.quantity,
            },
          }
        );
      }

      await Cart.deleteMany({
        user: req.user.id,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });

  } catch (err) {
    console.error(
      "CREATE ORDER ERROR:",
      err
    );

    return res.status(400).json({
      success: false,
      message:
        err.message ||
        "Could not create order",
    });
  }
}




async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });

  } catch (err) {
    console.error(
      "GET MY ORDERS ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}



async function getOneOrder(req, res) {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });

  } catch (err) {
    console.error(
      "GET ONE ORDER ERROR:",
      err
    );

    return res.status(400).json({
      success: false,
      message:
        err.message ||
        "Could not fetch order",
    });
  }
}


async function getAllOrders(req, res) {
  try {
    console.log("GET ALL ORDERS");
    console.log("ADMIN USER:", req.user);

    const orders = await Order.find()
      .populate("user", "fullName email")
      .sort({
        createdAt: -1,
      });

    console.log(
      "ORDERS FOUND:",
      orders.length
    );

    return res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      data: orders,
    });

  } catch (err) {
    console.error(
      "GET ALL ORDERS ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Could not fetch all orders",
    });
  }
}




async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;

    const order =
      await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
    });

  } catch (err) {
    console.error(
      "UPDATE ORDER STATUS ERROR:",
      err
    );

    return res.status(400).json({
      success: false,
      message:
        err.message ||
        "Could not update order status",
    });
  }
}




export {
  createOrder,
  getMyOrders,
  getOneOrder,
  getAllOrders,
  updateOrderStatus,
};