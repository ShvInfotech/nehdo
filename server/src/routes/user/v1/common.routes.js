const { ApplyCoupon,CheckShiping, PaymentOrder, verifyPayment } = require('../../../controller/user/v1/common.controller')
const { verifyjwtAccessToken } = require('../../../middleware/jwtToken')

const router = require('express').Router()



router.post('/couponapply',verifyjwtAccessToken,ApplyCoupon)
router.post('/checkshiping',verifyjwtAccessToken,CheckShiping)
router.post('/paymentOrder',verifyjwtAccessToken,PaymentOrder)
router.post('/verifypayment',verifyjwtAccessToken,verifyPayment)



module.exports= router