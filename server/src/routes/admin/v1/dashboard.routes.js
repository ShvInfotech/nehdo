const { getAdminDashboard, getAdminReports } = require('../../../controller/admin/v1/dashboard.controller')

const router = require('express').Router()


router.get('/get',getAdminDashboard)
router.get('/get-eeports',getAdminReports)


module.exports= router