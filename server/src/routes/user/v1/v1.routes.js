const router = require('express').Router()


router.use('/auth',require('./auth.routes'))
router.use('/product',require('./product.routes'))

router.use('/cart',require('./cart.routes'))
router.use('/wishlist',require('./wishlist.routes'))
router.use('/common',require('./common.routes'))
router.use('/address',require('./address.routes'))




module.exports= router