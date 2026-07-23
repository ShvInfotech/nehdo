const router = require('express').Router()


router.use('/auth',require('./auth.routes'))
router.use('/product',require('./product.routes'))




module.exports= router