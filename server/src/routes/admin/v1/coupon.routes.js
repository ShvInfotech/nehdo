const { AddCoupon, GetCoupon, UpdateCoupon } = require('../../../controller/admin/v1/coupon.controller')
const { verifyjwtAccessToken, checkRole } = require('../../../middleware/jwtToken')

const router = require('express').Router()


router.post('/add',verifyjwtAccessToken,checkRole('admin'),AddCoupon)
router.get('/get',verifyjwtAccessToken,checkRole('admin'),GetCoupon)
router.patch('/update/:id', verifyjwtAccessToken,checkRole('admin'),UpdateCoupon);
module.exports= router