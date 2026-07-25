const { AddWishlist, GetWishlist, DeleteWishlist } = require('../../../controller/user/v1/wishlist.controller')
const { verifyjwtAccessToken } = require('../../../middleware/jwtToken')

const router = require('express').Router()


router.post('/add',verifyjwtAccessToken,AddWishlist)
router.get('/get',verifyjwtAccessToken,GetWishlist)
router.delete('/delete/:id',verifyjwtAccessToken,DeleteWishlist)
module.exports = router