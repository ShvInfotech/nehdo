const { PendingOrder } = require('../../../controller/admin/v1/order.controller')
const { verifyjwtAccessToken, checkRole } = require('../../../middleware/jwtToken')

const router = require('express').Router()


router.get('/pending',verifyjwtAccessToken,checkRole('admin'),PendingOrder)

module.exports= router