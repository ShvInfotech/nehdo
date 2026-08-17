const router = require('express').Router()


router.use('/brand',require("./brand.routes"))
router.use('/category',require("./category.routes"))
router.use('/subCategory',require("./subcategory.routes"))

router.use('/product',require('./product.routes'))
router.use('/coupon',require('./coupon.routes'))
router.use('/order',require('./order.routes'))
module.exports= router