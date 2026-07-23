const { AllProduct,GetSingalProduct } = require('../../../controller/user/v1/product.controller')
const { verifyjwtAccessToken } = require('../../../middleware/jwtToken')

const router = require('express').Router()


router.get('/',AllProduct)
router.get('/:id',GetSingalProduct)

module.exports= router