const { AddCart, Getcart, Updatecart, Deletecart } = require('../../../controller/user/v1/cart.controller')
const { verifyjwtAccessToken } = require('../../../middleware/jwtToken')

const router = require('express').Router()



router.post('/add',verifyjwtAccessToken,AddCart)
router.get('/get',verifyjwtAccessToken,Getcart)
router.patch('/update/:id',verifyjwtAccessToken,Updatecart)
router.delete('/delete/:id',verifyjwtAccessToken,Deletecart)



module.exports= router