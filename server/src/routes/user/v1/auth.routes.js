const { UserRegister, UserLogin, GoogelLogin, UpdateUserProfile } = require('../../../controller/user/v1/auth.controller')

const UploadImage = require('../../../middleware/imageUploading')
const { verifyjwtAccessToken } = require('../../../middleware/jwtToken')

const router = require('express').Router()


router.post('/register',UserRegister)
router.post('/login',UserLogin)
router.post('/googlelogin',GoogelLogin)

router.post('/updateprofile/:id',verifyjwtAccessToken,UploadImage.single("profile"),UpdateUserProfile)



module.exports= router