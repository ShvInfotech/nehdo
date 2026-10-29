const { AddSubCategory, GetSubCategory, UpdateSubcategory, DeleteSubcategory } = require('../../../controller/admin/v1/subcategory.controller')
const { verifyjwtAccessToken, checkRole } = require('../../../middleware/jwtToken')
const UploadImage = require('../../../middleware/imageUploading')
const router = require('express').Router()


router.post('/add', verifyjwtAccessToken, checkRole('admin'), UploadImage.single('subcategorylogo'), AddSubCategory)
router.get('/get', verifyjwtAccessToken, checkRole('admin'), GetSubCategory)
router.patch('/update/:id', verifyjwtAccessToken, checkRole('admin'), UploadImage.single('subcategorylogo'), UpdateSubcategory)
router.delete('/delete/:id', verifyjwtAccessToken, checkRole('admin'), DeleteSubcategory)

module.exports = router