import express from "express";

import AuthMiddleware
    from "../MiddleWare/AuthMiddleware.js";

import {
    initializePayment,
    chapaCallback,
    chapaWebhook,
} from "../controllers/chapaController.js";


const router = express.Router();


router.post(
    "/chapa/initialize",
    AuthMiddleware,
    initializePayment
);


router.get(
    "/chapa/callback",
    chapaCallback
);


router.post(
    "/chapa/webhook",
    chapaWebhook
);


export default router;