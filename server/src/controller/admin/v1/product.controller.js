const mongoose = require('mongoose')
const { CustomeError } = require('../../../middleware/globelError')
const productModel = require('../../../model/product.model')
const productVariantModel = require('../../../model/productvariant.model')
const productInventoryModel = require('../../../model/productinventory.model')
const productShippingModel = require('../../../model/productshipping.model')
const categoryModel = require('../../../model/category.model')
const subcategoryModel = require('../../../model/subcategory.model')
const brandModel = require('../../../model/brand.model')
const { generateSKU, generateBarcode, generateSlug, DeleteImage } = require('../../../helper/helper')
const { getproductspipeline, getproductslugpipeline, getproductpaginationpipeline } = require('../../../helper/aggretionpipeline')
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

        const category = await categoryModel.findById(req.body.categoryId)
        if (!category) {
            return next(CustomeError(404, 'category not found'))
        }

        const subcategory = await subcategoryModel.findById(req.body.subcategoryId)
        if (!subcategory) {
            return next(CustomeError(404, 'subcategory not found'))
        }

        const brand = await brandModel.findById(req.body.brandId)
        if (!brand) {
            return next(CustomeError(404, 'brand not found'))
        }

        const productImage = []
        if (req.files?.length) {
            req.files?.forEach(file => {
                const imagepath = `/uploads/${file.fieldname}/${file.filename}`
                productImage.push(imagepath)
            });
        }

        const tags = req.body.tags ? req.body.tags.split(",").map(item => item.trim()) : [];
        console.log(typeof req.body.flags)
        const productData = {
            ...req.body,
            sku: generateSKU(),
            barcode: generateBarcode(),
            tags,
            productImage,
            slug: generateSlug(req.body.name),
            flags: typeof req.body.flags === "string"
                ? JSON.parse(req.body.flags)
                : req.body.flags,
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
            const size =
                typeof req.body.size === "string"
                    ? JSON.parse(req.body.size)
                    : req.body.size;

            variantData.size = size || [];
        }

        if (req.body?.colors) {
            const colorOptions =
                typeof req.body.colors === "string"
                    ? JSON.parse(req.body.colors)
                    : req.body.colors;

            variantData.colorOptions = colorOptions || [];
        }

        if (req.body.material) {
            variantData.material =
                typeof req.body.material === "string"
                    ? req.body.material
                    : req.body.material[0] || "";
        }

        if (req.body.variant) {
            const variant =
                typeof req.body.variant === "string"
                    ? JSON.parse(req.body.variant)
                    : req.body.variant;

            variant.forEach((v, i) => {
                variantData.variant.push({
                    name: v.name,
                    price: Number(v.price) || 0,
                    stock: Number(v.stock) || 0,
                    sku: v.sku || `${product.sku}-${i + 1}`,
                });
            });
        }


        const variant = await productVariantModel.create(variantData)


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

        const inventory = await productInventoryModel.create(inventoryData)


        const shippingData = {
            productId: product._id,
            shipping: true,
            weight: 0.1,
            dimensions: {},
            HSCode: ''
        }

        if (req.body?.shipping == "false" || req.body?.shipping == false) {
            shippingData.shipping = false
        }

        if (req.body.weight !== undefined && req.body.weight !== "") {
            const parsedWeight = parseFloat(req.body.weight);

            if (!isNaN(parsedWeight) && parsedWeight >= 0.1) {
                shippingData.weight = parsedWeight;
            }
        }

        if (req.body?.dimensions) {
            const dimensions = typeof req.body.dimensions === "string" ? JSON.parse(req.body.dimensions) : req.body.dimensions;
            shippingData.dimensions = dimensions
        }

        if (req.body?.HSCode) {
            shippingData.HSCode = req.body?.HSCode
        }

        const shipping = await productShippingModel.create(shippingData)

        return res.status(200).json({ success: true, message: 'peoduct added successfully', productData: { product, inventory, variant, shipping } })


    } catch (error) {
        return next(error)
    }
}


exports.GetProducts = async (req, res, next) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const pipeline = [
            ...getproductspipeline(),
            ...getproductpaginationpipeline(page, limit)
        ];

        const result = await productModel.aggregate(pipeline);

        const products = result[0].data;
        const total = result[0].totalCount[0]?.count || 0;
        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            success: true,
            message: "get product",
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasPrev: page > 1,
                hasNext: page < totalPages
            }
        });

    } catch (error) {
        return next(error);
    }
};


exports.EditProducts = async (req, res, next) => {
    try {
        const id = req.params.id
        const product = await productModel.findById(id)
        if (product.productImage.length) {
            product.productImage = product.productImage.map(
                image => `http://${process.env.HOST}:${process.env.PORT}${image}`
            );
        }
        if (!product) {
            return next(CustomeError(404, "product not found"))
        }
        const variant = await productVariantModel.findOne({ productId: product._id })
        const inventory = await productInventoryModel.findOne({ productId: product._id })
        const shipping = await productShippingModel.findOne({ productId: product._id })

        return res.status(200).json({ success: true, message: 'get product info', product, variant, inventory, shipping })
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
        if (req.body?.brandId) {
            productData.brandId = req.body.brandId
        }

        if (req.body?.subcategoryId) {
            productData.subcategoryId = req.body.subcategoryId
        }

        if (req.body?.categoryId) {
            productData.categoryId = req.body.categoryId
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
            const flags = typeof req.body.flags === "string" ? JSON.parse(req.body?.flags) : req.body?.flags
            productData.flags = flags
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

                deleteIndex.forEach((value, index) => {
                    DeleteImage(productData.productImage[value])
                })
                const newproductImage = productData.productImage.filter((_, index) => !deleteIndex.includes(index));
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
            variantData.size =
                typeof req.body.size === 'string'
                    ? JSON.parse(req.body.size)
                    : req.body.size;
        }

        if (req.body?.colors) {
            variantData.colorOptions =
                typeof req.body.colors === 'string'
                    ? JSON.parse(req.body.colors)
                    : req.body.colors;
        }

        if (req.body.material) {
            variantData.material = req.body.material || ''
        }

        // Existing variants update
        let existingVariants = [];

        if (req.body?.variant) {
            existingVariants =
                typeof req.body.variant === "string"
                    ? JSON.parse(req.body.variant)
                    : req.body.variant;
        }

        if (existingVariants.length) {
            for (const item of existingVariants) {
                variantData.variant.forEach((v) => {
                    if (String(v._id) === String(item._id)) {
                        v.stock = item.stock;
                        v.price = item.price;
                        v.sku = item.sku || v.sku;
                    }
                });
            }
        }

        // New variants add
        let newVariants = [];

        if (req.body?.newvariant) {
            newVariants =
                typeof req.body.newvariant === "string"
                    ? JSON.parse(req.body.newvariant)
                    : req.body.newvariant;
        }

        if (newVariants.length) {
            let length = variantData.variant.length + 1;

            for (const item of newVariants) {
                item.sku = item.sku || `${product.sku}-${length}`;

                const exists = variantData.variant.some(
                    (v) => v.name === item.name
                );

                if (!exists) {
                    variantData.variant.push(item);
                    length++;
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

        if (req.body?.weight && req.body?.weight >= 0.1) {
            shippingData.weight = req.body?.weight
        }

        console.log("print dimention", req.body?.dimensions)
        if (req.body?.dimensions) {
            shippingData.dimensions = JSON.parse(req.body?.dimensions)
        }

        if (req.body?.HSCode) {
            shippingData.HSCode = req.body?.HSCode
        }


        const updateproduct = await productModel.findByIdAndUpdate(id, productData, { returnDocument: 'after' })
        const variant = await productVariantModel.findByIdAndUpdate(variantData._id, variantData, { returnDocument: 'after' })
        const inventory = await productInventoryModel.findByIdAndUpdate(inventoryData._id, inventoryData, { returnDocument: 'after' })
        const shhiping = await productShippingModel.findByIdAndUpdate(shippingData._id, shippingData, { returnDocument: 'after' })
        return res.status(200).json({ success: true, message: "product update successfully" })
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




// [{"name": "White/XS","price": 400,"stock": 20},{"name": "White/S","price": 400,"stock": 20},{"name": "Black/XS","price": 400,"stock": 20},{"name": "Black/S","price": 400,"stock": 20}]