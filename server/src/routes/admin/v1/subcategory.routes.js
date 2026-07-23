const { AddSubCategory, GetSubCategory, UpdateSubcategory } = require('../../../controller/admin/v1/subcategory.controller')
const UploadImage = require('../../../middleware/imageUploading')
const { verifyjwtAccessToken, checkRole } = require('../../../middleware/jwtToken')

const router = require('express').Router()


router.post('/add',verifyjwtAccessToken,checkRole('admin'),UploadImage.single('subcategorylogo'),AddSubCategory)
router.get('/get',verifyjwtAccessToken,checkRole('admin'),GetSubCategory)
router.patch('/update/:id',verifyjwtAccessToken,checkRole('admin'),UploadImage.single('subcategorylogo'),UpdateSubcategory)


module.exports= router