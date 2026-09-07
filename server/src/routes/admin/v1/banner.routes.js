const { AddBanner, GetBanner, UpdateBanner, AddPromo, GetPromo, UpdatePromo, DeleteBanner, DeletePromo } = require('../../../controller/admin/v1/banner.controller')
const { verifyjwtAccessToken, checkRole } = require('../../../middleware/jwtToken')
const UploadImage = require('../../../middleware/imageUploading')
const router = require('express').Router()

router.post('/add', verifyjwtAccessToken, checkRole('admin'), UploadImage.fields([{ name: "desktopImage", maxCount: 1, }, { name: "mobileImage", maxCount: 1, },]), AddBanner)
router.get('/get', verifyjwtAccessToken, checkRole('admin'), GetBanner)
router.patch("/update/:id", verifyjwtAccessToken, checkRole('admin'), UploadImage.fields([{ name: "desktopImage", maxCount: 1, }, { name: "mobileImage", maxCount: 1, },]), UpdateBanner);
router.delete("/delete/:id", verifyjwtAccessToken, checkRole('admin'), DeleteBanner);


router.post('/promo/add', verifyjwtAccessToken, checkRole('admin'), AddPromo)
router.get('/promo/get', verifyjwtAccessToken, checkRole('admin'), GetPromo)
router.patch('/promo/update/:id', verifyjwtAccessToken, checkRole('admin'), UpdatePromo)
router.delete("/promo/delete/:id", verifyjwtAccessToken, checkRole('admin'), DeletePromo);

module.exports = router