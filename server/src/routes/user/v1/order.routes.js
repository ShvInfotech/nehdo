
const { GetOrders, CancelledOrder, ReturnOrder } = require('../../../controller/user/v1/order.controller')
const { verifyjwtAccessToken } = require('../../../middleware/jwtToken')
const router = require('express').Router()


router.get('/get', verifyjwtAccessToken, GetOrders)
router.post('/cancelle', verifyjwtAccessToken, CancelledOrder)
router.post('/return', verifyjwtAccessToken, ReturnOrder)


module.exports = router