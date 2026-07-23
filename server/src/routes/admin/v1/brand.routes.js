const { AddBrand, GetBrand, UpdateBrand } = require('../../../controller/admin/v1/brand.controller')
const UploadImage = require('../../../middleware/imageUploading')
const { verifyjwtAccessToken, checkRole } = require('../../../middleware/jwtToken')

const router = require('express').Router()


router.post('/add',verifyjwtAccessToken,checkRole('admin'),UploadImage.single('brandlogo'),AddBrand)
router.get('/get',verifyjwtAccessToken,checkRole('admin'),GetBrand)
router.patch('/update/:id',verifyjwtAccessToken,checkRole('admin'),UploadImage.single('brandlogo'),UpdateBrand)


module.exports= router