const mongoose = require('mongoose')
const { CustomeError } = require('../../middleware/globelError')
const productModel = require('../../model/product.model')
const productVariantModel = require('../../model/productvariant.model')
const productInventoryModel = require('../../model/productinventory.model')
const productShippingModel = require('../../model/productshipping.model')
const { generateSKU, generateBarcode, generateSlug } = require('../../helper/helper')
const { getproductspipeline, getproductslugpipeline } = require('../../helper/aggretionpipeline')



exports.AddProduct = async (req, res, next) => {
    try {

        if (!req.body?.name) {
            return next(CustomeError(422, 'product name is required '))
        }

        if (!req.body?.categoryId) {
            return next(CustomeError(422, 'categoryId  is required '))
        }

        if (!mongoose.isValidObjectId(req.body?.categoryId)) {
            return next(CustomeError(409, 'invalid category id'))
        }


        if (!req.body?.subcategoryId) {
            return next(CustomeError(422, 'sub-categoryId is required '))
        }

        if (!mongoose.isValidObjectId(req.body?.subcategoryId)) {
            return next(CustomeError(409, 'invalid sub-category id'))
        }

        if (!req.body?.brandId) {
            return next(CustomeError(422, 'brand is required '))
        }

        if (!mongoose.isValidObjectId(req.body?.brandId)) {
            return next(CustomeError(409, 'invalid brand id'))
        }
        if (!req.body?.price) {
            return next(CustomeError(409, 'price is required'))

        }

        if (req.body?.price < 100) {
            return next(CustomeError(409, 'minimum price 100'))
        }

        if (!req.body?.salePrice) {
            return next(CustomeError(409, 'salePrice is required'))
        }

        if (req.body?.salePrice > req.body?.price) {
            return next(CustomeError(409, 'sale price can not set morethane price'))
        }

        if (!req?.files || req.files.length === 0) {
            return next(CustomeError(409, 'product image is required'))
        }

        const productImage = []
        if (req.files?.length) {
            req.files?.forEach(file => {
                const imagepath = `/uploads/${file.fieldname}/${file.filename}`
                productImage.push(imagepath)
            });
        }

        const tags = req.body.tags ? req.body.tags.split(",").map(item => item.trim()) : [];

        const productData = {
            ...req.body,
            sku: generateSKU(),
            barcode: generateBarcode(),
            tags,
            productImage,
            slug: generateSlug(req.body.name),
            flags: JSON.parse(req.body.flags),
        }

        const product = await productModel.create(productData)

        if (!product) {
            return next(CustomeError(500, 'Somthing wrong'))
        }


        const variantData = {
            productId: product._id,
            size: [],
            colorOptions: [],
            material: "",
            variant: []
        }

        if (req.body?.size) {
            variantData.size = req.body?.size || []
        }

        if (req.body?.colors) {
            variantData.colorOptions = req.body?.colors || []
        }

        if (req.body.material) {
            variantData.material = req.body.material || ''
        }

        if (req.body?.variant && req.body?.variant.length) {
            variantData.variant = req.body?.variant || []
        }


        const v = await productVariantModel.create(variantData)


        const inventoryData = {
            productId: product._id,
            stock: 0,
            lowStock: 0,
            warehouseLocation: '',
            trackInventory: false,
            backorders: false
        }

        if (req.body?.stock) {
            inventoryData.stock = req.body.stock
        }

        if (req.body?.lowStock) {
            inventoryData.lowStock = req.body.lowStock
        }

        if (req.body?.warehouseLocation) {
            inventoryData.warehouseLocation = req.body.warehouseLocation
        }

        if (req.body?.trackInventory == "true" || req.body?.trackInventory == true) {
            inventoryData.trackInventory = true
        }

        if (req.body?.backorders == "true" || req.body?.backorders == true) {
            inventoryData.backorders = true
        }

        const i = await productInventoryModel.create(inventoryData)


        const shippingData = {
            productId: product._id,
            shipping: true,
            weight: 1,
            dimensions: {},
            HSCode: ''
        }

        if (req.body?.shipping == "false" || req.body?.shipping == false) {
            shippingData.shipping = false
        }

        if (req.body?.weight && req.body?.weight > 1) {
            shippingData.weight = req.body?.weight
        }

        if (req.body?.dimensions) {
            shippingData.dimensions = req.body?.dimensions
        }

        if (req.body?.HSCode) {
            shippingData.HSCode = req.body?.HSCode
        }

        const s = await productShippingModel.create(shippingData)

        return res.status(200).json({ success: true, message: 'peoduct added successfully', product, v, i, s })





    } catch (error) {
        return next(error)
    }
}


exports.GetProducts = async (req, res, next) => {
    try {

        const products = await productModel.aggregate(getproductspipeline());

        return res.status(200).json({ success: true, message: "get product", products })
    } catch (error) {
        return next(error)
    }
}


exports.UpdateProduct = async(req,res,next) =>{
    try {
        const id = req.params.id

        if(!mongoose.isValidObjectId(id)){
            return next(CustomeError(409,"product id is invalid"))
        }

        const product = await productModel.findById(id)
        if(!product){
            return next(CustomeError(404,'product not found'))
        }

        
    } catch (error) {
        return next(error)
    }
}



exports.GetProductUsingSlug = async(req,res,next)=>{
    try {
        const slug = req.params.slug
        // const product = await productModel.findOne({slug:slug})
        const product = await productModel.aggregate(getproductslugpipeline(slug));

        return res.status(200).json({success:true,product})
    } catch (error) {
        return next(error)
    }
}