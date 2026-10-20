const router = require('express').Router()
const { razorpayWebhook, getShippingInfo, getPromotions, applyPromotion } = require('../controller/user/v1/magic.controller')

router.use('/admin/api/v1', require('./admin/v1/v1.routes'))
router.use('/user/api/v1', require('./user/v1/v1.routes'))
router.use('/api/v1/magic-checkout', require('./user/v1/magic.routes'))

// Central Webhook and Magic Checkout URL routing (convenience aliases for Razorpay Dashboard)
router.post('/api/webhooks/razorpay', razorpayWebhook)
router.post('/api/webhooks/razorpay/webhook', razorpayWebhook)
router.post('/api/webhooks/razorpay/shipping-info', getShippingInfo)
router.get('/api/webhooks/razorpay/shipping-info', getShippingInfo)
router.post('/api/webhooks/razorpay/promotions', getPromotions)
router.get('/api/webhooks/razorpay/promotions', getPromotions)
router.post('/api/webhooks/razorpay/apply-promo', applyPromotion)
router.get('/api/webhooks/razorpay/apply-promo', applyPromotion)
router.post('/api/webhooks/razorpay/apply-promotion', applyPromotion)
router.get('/api/webhooks/razorpay/apply-promotion', applyPromotion)

module.exports = router