const { GetReviews,UpdateReviews,DeleteReviews, ApproveAllReviews } = require('../../../controller/admin/v1/reviews.controller')
const { verifyjwtAccessToken, checkRole } = require('../../../middleware/jwtToken')

const router = require('express').Router()



router.get('/get',verifyjwtAccessToken,checkRole('admin'),GetReviews)
router.patch('/update/:id',verifyjwtAccessToken,checkRole('admin'),UpdateReviews)
router.delete('/delete/:id',verifyjwtAccessToken,checkRole('admin'),DeleteReviews)
router.patch('/approve-all',verifyjwtAccessToken,checkRole('admin'),ApproveAllReviews)
module.exports= router