const { getAdminDashboard, getAdminReports } = require('../../../controller/admin/v1/dashboard.controller')
const { verifyjwtAccessToken, checkRole } = require('../../../middleware/jwtToken')

const router = require('express').Router()


router.get('/get',verifyjwtAccessToken,checkRole('admin'), getAdminDashboard)
router.get('/get-reports',verifyjwtAccessToken,checkRole('admin'), getAdminReports)


module.exports = router