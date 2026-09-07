const { UserRegister, UserLogin, GoogelLogin, UpdateUserProfile, ForgotPassword, ResetPasswordpage, ResetPassword, LogOut } = require('../../../controller/user/v1/auth.controller')
const { verifyjwtAccessToken } = require('../../../middleware/jwtToken')
const UploadImage = require('../../../middleware/imageUploading')
const router = require('express').Router()


router.post('/register', UserRegister)
router.post('/login', UserLogin)
router.post('/googlelogin', GoogelLogin)
router.post('/updateprofile/:id', verifyjwtAccessToken, UploadImage.single("profile"), UpdateUserProfile)
router.post('/forgot-password', ForgotPassword)
router.get('/reset-password/:token', ResetPasswordpage)
router.post('/reset-password/:token', ResetPassword)
router.post('/logout', verifyjwtAccessToken, LogOut)


module.exports = router