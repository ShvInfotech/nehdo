
const { GetOrders } = require('../../../controller/user/v1/order.controller')
const { verifyjwtAccessToken } = require('../../../middleware/jwtToken')

const router = require('express').Router()




router.get('/get',verifyjwtAccessToken,GetOrders)



module.exports= router