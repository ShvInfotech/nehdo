const { AddBanner, GetBanner, UpdateBanner } = require('../../../controller/admin/v1/banner.controller')
const UploadImage = require('../../../middleware/imageUploading')
const { verifyjwtAccessToken, checkRole } = require('../../../middleware/jwtToken')

const router = require('express').Router()

router.post('/add',verifyjwtAccessToken,checkRole('admin'),UploadImage.fields([{name: "desktopImage",maxCount: 1,},{name: "mobileImage",maxCount: 1,},]),AddBanner)
router.get('/get',GetBanner)
router.patch("/update/:id",UploadImage.fields([{name: "desktopImage",maxCount: 1,},{name: "mobileImage",maxCount: 1,},]),UpdateBanner);

module.exports= router