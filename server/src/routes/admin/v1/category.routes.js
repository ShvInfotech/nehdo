const { AddCategory, GetCategory, Updatecategory } = require('../../../controller/admin/v1/category.controller')
const { verifyjwtAccessToken, checkRole } = require('../../../middleware/jwtToken')
const UploadImage = require('../../../middleware/imageUploading')
const router = require('express').Router()


router.post('/add', verifyjwtAccessToken, checkRole('admin'), UploadImage.single('categorylogo'), AddCategory)
router.get('/get', verifyjwtAccessToken, checkRole('admin'), GetCategory)
router.patch('/update/:id', verifyjwtAccessToken, checkRole('admin'), UploadImage.single('categorylogo'), Updatecategory)


module.exports = router