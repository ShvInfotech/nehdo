
const { default: mongoose } = require("mongoose");
const { userGetProductpipeline, userGetSingalsProductpipeline } = require("../../../helper/aggretionpipeline");
const productModel = require("../../../model/product.model");
const { CustomeError } = require("../../../middleware/globelError");

exports.AllProduct = async (req, res, next) => {
    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await productModel.aggregate(
            userGetProductpipeline({
                search: req.query.search,
                categoryId: req.query.categoryId,
                subcategoryId: req.query.subcategoryId,
                brandId: req.query.brandId,
                minPrice: req.query.minPrice,
                maxPrice: req.query.maxPrice,
                rating: req.query.rating,
                page,
                limit
            })
        );

        const products = result[0].products;

        const total = result[0].totalCount.length ? result[0].totalCount[0].total : 0;

        return res.status(200).json({
            success: true,
            message: "Get Product Successfully",
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },

            products
        });

    } catch (error) {
        return next(error);
    }
};

exports.GetSingalProduct = async (req, res, next) => {
    try {

        const id = req.params.id
        if (!mongoose.isValidObjectId(id)) {
            return CustomeError(422, "invalid productId")
        }

        const product = await productModel.aggregate(userGetSingalsProductpipeline(id))
        
        return res.status(200).json({success:true,message:"get product",product})


    } catch (error) {
        return next(error)
    }
}