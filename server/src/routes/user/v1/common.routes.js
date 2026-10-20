const { ApplyCoupon, CheckShiping, PaymentOrder, verifyPayment, GetCategory, GetBrands, GetBanners, placecodeorder, Getpromos } = require('../../../controller/user/v1/common.controller')
const { verifyjwtAccessToken, optionalJwtAccessToken } = require('../../../middleware/jwtToken')
const router = require('express').Router()

router.post('/couponapply', optionalJwtAccessToken, ApplyCoupon)
router.post('/checkshiping', optionalJwtAccessToken, CheckShiping)
router.post('/paymentOrder', optionalJwtAccessToken, PaymentOrder)
router.post('/verifypayment', optionalJwtAccessToken, verifyPayment)
router.post('/cod-order', verifyjwtAccessToken, placecodeorder)
router.get('/category', GetCategory)
router.get('/brands', GetBrands)
router.get('/banner', GetBanners)
router.get('/promo', Getpromos)

module.exports = router