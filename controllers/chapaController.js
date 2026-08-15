import Order from "../models/orderModel.js";
import crypto from "crypto";

import {
  initializeChapaPayment,
  verifyChapaTransaction,
  finalizePaidOrder,
} from "../services/chapaPaymentService.js";



export async function initializePayment(req, res) {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "orderId is required",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentMethod !== "chapa") {
      return res.status(400).json({
        success: false,
        message: "This order does not use Chapa",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(409).json({
        success: false,
        message: "Order is already paid",
      });
    }

    const payment = await initializeChapaPayment(order);

    return res.status(200).json({
      success: true,
      message: "Payment initialized",
      data: payment,
    });

  } catch (error) {
    console.error(
      "Chapa initialization error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to initialize payment",
    });
  }
}



export async function chapaCallback(req, res) {
  try {
    const tx_ref =
      req.query.trx_ref ||
      req.query.tx_ref;

    if (!tx_ref) {
      return res.status(400).send(
        "Missing transaction reference"
      );
    }

    const order = await Order.findOne({
      tx_ref,
    });

    if (!order) {
      return res.status(404).send(
        "Order not found"
      );
    }

    const transaction =
      await verifyChapaTransaction(tx_ref);

    const statusMatches =
      transaction.status === "success";

    const amountMatches =
      Number(transaction.amount) ===
      Number(order.total);

    const currencyMatches =
      transaction.currency === "ETB";

    const modeMatches =
      !transaction.mode ||
      transaction.mode === process.env.CHAPA_MODE;

    if (
      !statusMatches ||
      !amountMatches ||
      !currencyMatches ||
      !modeMatches
    ) {
      order.paymentStatus = "failed";

      await order.save();

      return res.redirect(
        `${process.env.FRONTEND_URL}/payment-failed/${order._id}`
      );
    }

    if (order.paymentStatus !== "paid") {
      await finalizePaidOrder(order._id);
    }

    return res.redirect(
      `${process.env.FRONTEND_URL}/payment-success/${order._id}`
    );

  } catch (error) {
    console.error(
      "Chapa callback error:",
      error.response?.data || error.message
    );

    return res.status(500).send(
      "Payment verification failed"
    );
  }
}




export async function chapaWebhook(req, res) {
  try {
    const receivedSignature =
      req.headers["x-chapa-signature"];

    if (!receivedSignature) {
      return res.status(401).json({
        success: false,
        message: "Missing webhook signature",
      });
    }

    const rawBody =
      req.rawBody ||
      Buffer.from(JSON.stringify(req.body));

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.CHAPA_WEBHOOK_SECRET
        )
        .update(rawBody)
        .digest("hex");

    if (receivedSignature !== expectedSignature) {
      return res.status(401).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    const reference =
      req.body?.data?.tx_ref ||
      req.body?.tx_ref;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Transaction reference missing",
      });
    }

    const order = await Order.findOne({
      tx_ref: reference,
    });

    if (!order) {
      return res.status(200).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(200).json({
        success: true,
        message: "Already processed",
      });
    }

    const transaction =
      await verifyChapaTransaction(reference);

    const valid =
      transaction.status === "success" &&
      Number(transaction.amount) ===
        Number(order.total) &&
      transaction.currency === "ETB" &&
      (
        !transaction.mode ||
        transaction.mode ===
          process.env.CHAPA_MODE
      );

    if (!valid) {
      order.paymentStatus = "failed";

      await order.save();

      return res.status(200).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    await finalizePaidOrder(order._id);

    return res.status(200).json({
      success: true,
      message: "Payment confirmed",
    });

  } catch (error) {
    console.error(
      "Chapa webhook error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
}