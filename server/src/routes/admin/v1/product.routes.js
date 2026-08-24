const { AddProduct,GetProducts, GetProductUsingSlug, UpdateProduct, EditProducts,GetInventory,UpdateInventory } = require('../../../controller/admin/v1/product.controller')
const UploadImage = require('../../../middleware/imageUploading')
const { verifyjwtAccessToken, checkRole } = require('../../../middleware/jwtToken')

const router = require('express').Router()


router.post('/add',verifyjwtAccessToken,checkRole('admin'),UploadImage.array('productImage',5),AddProduct)
router.get('/get',verifyjwtAccessToken,checkRole('admin'),GetProducts)
router.get('/edit/:id',verifyjwtAccessToken,checkRole('admin'),EditProducts)
router.patch('/update/:id',verifyjwtAccessToken,checkRole('admin'),UploadImage.array('productImage',5),UpdateProduct)

router.get('/inventory/get',GetInventory)
router.patch('/inventory/update-stock',UpdateInventory)


router.get('/:slug',GetProductUsingSlug)

module.exports= router