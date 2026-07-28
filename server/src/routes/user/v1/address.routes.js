const { AddAddress, UpdateAddress, DeleteAddress,GetAddress } = require('../../../controller/user/v1/address.controller')
const { verifyjwtAccessToken } = require('../../../middleware/jwtToken')

const router = require('express').Router()

router.post('/add',verifyjwtAccessToken,AddAddress)
router.get('/get',verifyjwtAccessToken,GetAddress)
router.patch('/update/:id',verifyjwtAccessToken,UpdateAddress)
router.delete('/delete/:id',verifyjwtAccessToken,DeleteAddress)

module.exports= router