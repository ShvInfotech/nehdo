const mongoose = require('mongoose')
const { CustomeError } = require('../../../middleware/globelError')
const productModel = require('../../../model/product.model')
const productVariantModel = require('../../../model/productvariant.model')
const productInventoryModel = require('../../../model/productinventory.model')
const productShippingModel = require('../../../model/productshipping.model')
const { generateSKU, generateBarcode, generateSlug, DeleteImage } = require('../../../helper/helper')
const { getproductspipeline, getproductslugpipeline } = require('../../../helper/aggretionpipeline')
const { i } = require('framer-motion/client')



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
            const size = JSON.parse(req.body?.size)
            variantData.size = size || []
        }

        if (req.body?.colors) {
            const colorOptions = JSON.parse(req.body?.colors)

            variantData.colorOptions = colorOptions || []
        }

        if (req.body.material) {
            variantData.material = req.body.material || ''
        }

        if (req.body?.variant && req.body?.variant.length) {
            const variant = JSON.parse(req.body?.variant)
            console.log(typeof variant)
            variant.forEach((v, i) => {
                v.sku = `${product.sku}-${i + 1}`
                variantData.variant.push(v)
            })
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


exports.UpdateProduct = async (req, res, next) => {
    try {
        const id = req.params.id

        if (!mongoose.isValidObjectId(id)) {
            return next(CustomeError(409, "product id is invalid"))
        }

        const product = await productModel.findById(id)

        if (!product) {
            return next(CustomeError(404, 'product not found'))
        }

        let productData = product

        if (req.body?.name) {
            productData.name = req.body?.name
        }

        if (req.body?.price) {
            productData.price = req.body?.price
        }

        if (req.body?.salePrice && req.body?.salePrice < req.body?.price) {
            productData.salePrice = req.body?.salePrice
        }

        if (req.body?.itemCost) {
            productData.price = req.body?.itemCost
        }

        if (req.body?.tags) {
            productData.tags = req.body?.tags ? req.body?.tags.split(",").map(item => item.trim()) : [];
        }

        if (req.body?.shortDescription) {
            productData.shortDescription = req.body?.shortDescription
        }

        if (req.body?.longDescription) {
            productData.longDescription = req.body?.longDescription
        }

        if (req.body?.status) {
            productData.status = req.body?.status
        }

        if (req.body?.visibility) {
            productData.visibility = req.body?.visibility
        }

        if (req.body?.flags) {
            productData.flags = JSON.parse(req.body?.flags)
        }

        if (req.body?.flags) {
            productData.flags = JSON.parse(req.body?.flags)
        }

        if (req.body?.metaTitle) {
            productData.metaTitle = req.body?.metaTitle
        }

        if (req.body?.metaDescription) {
            productData.metaDescription = req.body?.metaDescription
        }

        if (req.body?.deleteImage) {
            const deleteIndex = Array.isArray(req.body.deleteImage) ? req.body.deleteImage : JSON.parse(req.body.deleteImage);
            if (deleteIndex.length) {
                console.log("delete image index", deleteIndex)
                deleteIndex.forEach((value, index) => {
                    DeleteImage(productData.productImage[value])
                })
                const newproductImage = productData.productImage.filter((_, index) => !deleteIndex.includes(index));
                console.log("new product image", newproductImage)
                productData.productImage = newproductImage
                console.log("after fileter productimages", productData.productImage)
            }
        }

        if (req.files && req.files?.length) {


            req.files.forEach((file) => {
                const imagepath = `/uploads/${file.fieldname}/${file.filename}`
                productData.productImage.push(imagepath)
            })
        }

        let variantData = await productVariantModel.findOne({ productId: product._id })
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
            for (const item of req.body.variant) {
                variantData.variant.forEach((v) => {
                    if (v._id == item._id) {
                        v.stock = item.stock,
                            v.price = item.price
                    }
                })
            }
        }

        if (req.body?.newvariant && req.body?.newvariant.length) {
            const newvariant = []
            let length = variantData.variant.length + 1
            for (const item of req.body.newvariant) {
                item.sku = `${product.sku}-${length}`
                let check = false
                variantData.variant.forEach((v) => {
                    if (v.name === item.name) {
                        check = true
                    }
                })
                if (!check) {
                    variantData.variant.push(item)
                    length++
                }
            }
        }







        let inventoryData = await productInventoryModel.findOne({ productId: product._id })
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

        let shippingData = await productShippingModel.findOne({ productId: product._id })
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


        const updateproduct = await productModel.findByIdAndUpdate(id, productData, { returnDocument: 'after' })
        const variant = await productVariantModel.findByIdAndUpdate(variantData._id, variantData, { returnDocument: 'after' })
        const inventory = await productInventoryModel.findByIdAndUpdate(inventoryData._id, inventoryData, { returnDocument: 'after' })
        const shhiping = await productShippingModel.findByIdAndUpdate(shippingData._id, shippingData, { returnDocument: 'after' })
        return res.status(200).json({success:true,message:"product update successfully"})
    } catch (error) {
        return next(error)
    }
}



exports.GetProductUsingSlug = async (req, res, next) => {
    try {
        const slug = req.params.slug
        // const product = await productModel.findOne({slug:slug})
        const product = await productModel.aggregate(getproductslugpipeline(slug));

        return res.status(200).json({ success: true, product })
    } catch (error) {
        return next(error)
    }
}