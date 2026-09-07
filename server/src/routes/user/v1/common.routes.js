const { ApplyCoupon, CheckShiping, PaymentOrder, verifyPayment, GetCategory, GetBrands, GetBanners, placecodeorder, Getpromos } = require('../../../controller/user/v1/common.controller')
const { verifyjwtAccessToken } = require('../../../middleware/jwtToken')
const router = require('express').Router()


router.post('/couponapply', verifyjwtAccessToken, ApplyCoupon)
router.post('/checkshiping', verifyjwtAccessToken, CheckShiping)
router.post('/paymentOrder', verifyjwtAccessToken, PaymentOrder)
router.post('/verifypayment', verifyjwtAccessToken, verifyPayment)
router.post('/cod-order', verifyjwtAccessToken, placecodeorder)
router.get('/category', GetCategory)
router.get('/brands', GetBrands)
router.get('/banner', GetBanners)
router.get('/promo', Getpromos)


module.exports = router