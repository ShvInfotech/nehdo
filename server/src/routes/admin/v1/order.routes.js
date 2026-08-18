const { PendingOrder,AccepteOrder,ShippingWebhook } = require('../../../controller/admin/v1/order.controller')
const { verifyjwtAccessToken, checkRole } = require('../../../middleware/jwtToken')

const router = require('express').Router()


router.get('/get',verifyjwtAccessToken,checkRole('admin'),PendingOrder)
router.post('/accepte',verifyjwtAccessToken,checkRole('admin'),AccepteOrder)

router.post('/shipping/webhook',ShippingWebhook)

module.exports= router