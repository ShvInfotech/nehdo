const { ApplyCoupon,CheckShiping } = require('../../../controller/user/v1/common.controller')
const { verifyjwtAccessToken } = require('../../../middleware/jwtToken')

const router = require('express').Router()



router.post('/couponapply',verifyjwtAccessToken,ApplyCoupon)
router.post('/checkshiping',verifyjwtAccessToken,CheckShiping)



module.exports= router