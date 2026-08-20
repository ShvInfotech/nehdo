const { GetCustomers,UpdateCustomer, sendMailCustomer } = require('../../../controller/admin/v1/customers.controller')
const { verifyjwtAccessToken, checkRole } = require('../../../middleware/jwtToken')

const router = require('express').Router()


router.get('/get',verifyjwtAccessToken,checkRole('admin'),GetCustomers)
router.patch('/update/:id',verifyjwtAccessToken,checkRole('admin'),UpdateCustomer)
router.post('/sendmail',verifyjwtAccessToken,checkRole('admin'),sendMailCustomer)

module.exports= router