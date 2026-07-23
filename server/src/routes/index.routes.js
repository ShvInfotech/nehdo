const router = require('express').Router()

router.use('/admin/api/v1',require('./admin/v1/v1.routes'))
router.use('/user/api/v1',require('./user/v1/v1.routes'))

module.exports = router