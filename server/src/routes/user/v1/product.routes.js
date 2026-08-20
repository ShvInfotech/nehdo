const { AllProduct,GetSingalProductReview,CreateReview } = require('../../../controller/user/v1/product.controller')
const { verifyjwtAccessToken } = require('../../../middleware/jwtToken')

const router = require('express').Router()


router.get('/',AllProduct)
router.get('/reviews/:id',GetSingalProductReview)
router.post('/review/create',verifyjwtAccessToken,CreateReview)

module.exports= router