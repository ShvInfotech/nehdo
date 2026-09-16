const { PendingOrder, AccepteOrder, GanrateLabel, ShippingWebhook, CanceledOrderRequest, RefundWebhook, TestController } = require('../../../controller/admin/v1/order.controller')
const { verifyjwtAccessToken, checkRole } = require('../../../middleware/jwtToken')
const express = require('express')
const router = require('express').Router()


router.get('/get', verifyjwtAccessToken, checkRole('admin'), PendingOrder)
router.post('/accepte', verifyjwtAccessToken, checkRole('admin'), AccepteOrder)
router.post('/label', verifyjwtAccessToken, checkRole('admin'), GanrateLabel)
router.get('/canceled',verifyjwtAccessToken,checkRole('admin'), CanceledOrderRequest)

router.post('/refund/webhook', express.raw({ type: "application/json" }), RefundWebhook)
router.post('/shipping/webhook', ShippingWebhook)




module.exports = router