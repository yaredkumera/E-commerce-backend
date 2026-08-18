import axios from "axios";
import mongoose from "mongoose";

import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";



const CHAPA_BASE_URL =
  "https://api.chapa.co/v1/transaction";

export async function initializeChapaPayment(order) {
  const tx_ref =
    order.tx_ref ||
    `ORDER-${order._id}-${Date.now()}`;

  const response = await axios.post(
    `${CHAPA_BASE_URL}/initialize`,
    {
      amount: String(order.total),
      currency: "ETB",
      email: order.email,
      first_name: order.firstName,
      phone_number: order.phoneNumber,
      tx_ref,

      callback_url:
        `${process.env.BACKEND_URL}/api/chapa/callback`,

      return_url:
        `${process.env.FRONTEND_URL}/payment-success/${order._id}`,

      customization: {
        title: "Exclusive Store",
        description: `Payment for Order ${order._id}`,
      },
    },
    {
      headers: {
        Authorization:
          `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const checkoutUrl =
    response.data?.data?.checkout_url;

  if (!checkoutUrl) {
    throw new Error("No Chapa checkout URL");
  }

  order.tx_ref = tx_ref;
  await order.save();

  return {
    checkoutUrl,
    tx_ref,
  };
}




export async function verifyChapaTransaction(tx_ref) {
  const response = await axios.get(
    `${CHAPA_BASE_URL}/verify/${encodeURIComponent(tx_ref)}`,
    {
      headers: {
        Authorization:
          `Bearer ${process.env.CHAPA_SECRET_KEY}`,
      },
    }
  );

console.log(response.data)
  const transaction =
    response.data?.data;

  if (!transaction) {
    throw new Error("No transaction returned");
  }

  return transaction;
}



export async function finalizePaidOrder(orderId) {

    const session =
        await mongoose.startSession();

    try {

        let finalOrder;

        await session.withTransaction(async () => {

            const order =
                await Order.findOne({
                    _id: orderId, 
                    paymentStatus: {
                        $ne: "paid",
                    },
                }).session(session);

            if (!order) {
                return;
            }



            for (const item of order.items) {

                const product =
                    await Product.findById(
                        item.product
                    ).session(session);

                if (!product) {
                    throw new Error(
                        `Product ${item.product} no longer exists`
                    );
                }

                if (
                    product.stock <
                    item.quantity
                ) {
                    throw new Error(
                        `Not enough stock for ${item.name}`
                    );
                }
            } 


            for (const item of order.items) {

                const result =
                    await Product.updateOne(
                        {
                            _id: item.product,

                            stock: {
                                $gte:
                                    item.quantity,
                            },
                        },

                        {
                            $inc: {
                                stock:
                                    -item.quantity,
                            },
                        },

                        {
                            session,
                        }
                    );

                if (
                    result.modifiedCount !== 1
                ) {
                    throw new Error(
                        `Stock update failed for ${item.name}`
                    );
                }
            }



            order.paymentStatus = "paid";

            order.status = "processing";

            await order.save({
                session,
            });


            for (const item of order.items) {

                await Cart.deleteOne(
                    {
                        user: order.user,
                        product: item.product,
                    },
                    {
                        session,
                    }
                );
            }


            finalOrder = order;
        });

        return {
            order: finalOrder,
            alreadyProcessed: !finalOrder,
        };

    } finally {

        await session.endSession();
    }
}