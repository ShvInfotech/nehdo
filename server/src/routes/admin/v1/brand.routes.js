const { AddBrand, GetBrand, UpdateBrand, DeleteBrand } = require('../../../controller/admin/v1/brand.controller')
const { verifyjwtAccessToken, checkRole } = require('../../../middleware/jwtToken')
const UploadImage = require('../../../middleware/imageUploading')
const router = require('express').Router()


router.post('/add', verifyjwtAccessToken, checkRole('admin'), UploadImage.single('brandlogo'), AddBrand)
router.get('/get', verifyjwtAccessToken, checkRole('admin'), GetBrand)
router.patch('/update/:id', verifyjwtAccessToken, checkRole('admin'), UploadImage.single('brandlogo'), UpdateBrand)
router.delete('/delete/:id', verifyjwtAccessToken, checkRole('admin'), DeleteBrand)

module.exports = router