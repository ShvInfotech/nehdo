const { AddAddress } = require('../../../controller/user/v1/address.controller')
const { verifyjwtAccessToken } = require('../../../middleware/jwtToken')

const router = require('express').Router()

router.post('/add',verifyjwtAccessToken,AddAddress)

module.exports= router