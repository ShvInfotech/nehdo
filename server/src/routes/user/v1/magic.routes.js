const {
    createMagicOrder,
    getShippingInfo,
    getPromotions,
    applyPromotion,
    completeMagicOrder,
    verifyMagicOrder,
    razorpayWebhook
} = require("../../../controller/user/v1/magic.controller");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const userModel = require("../../../model/user.model");
const router = require('express').Router()
const optionalJwtAccessToken = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth) return next();
        const token = auth.split(" ")[1];
        if (!token) return next();
        const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!mongoose.isValidObjectId(decodeToken.id)) return next();
        const user = await userModel.findById(decodeToken.id);
        if (user) {
            req.user = user;
        }
        next();
    } catch (e) {
        next();
    }
};

// Create Magic Order
router.post("/create-order", optionalJwtAccessToken, createMagicOrder);

// Verify & Finalize Magic Order
router.post("/verify-order", optionalJwtAccessToken, verifyMagicOrder || completeMagicOrder);
router.post("/complete", optionalJwtAccessToken, completeMagicOrder);

// Endpoints mapped in Razorpay Dashboard for Magic Checkout
// URL for shipping info (Both GET and POST)
router.post("/shipping-info", getShippingInfo);
router.get("/shipping-info", getShippingInfo);

// URL for get promotions (Both GET and POST)
router.post("/promotions", getPromotions);
router.get("/promotions", getPromotions);

// URL for apply promotions (Both GET and POST)
router.post("/apply-promotion", applyPromotion);
router.get("/apply-promotion", applyPromotion);
router.post("/apply-promo", applyPromotion);

// Webhook endpoint
router.post("/webhook", razorpayWebhook);

module.exports = router;
