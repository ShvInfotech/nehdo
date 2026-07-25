
const { default: mongoose } = require("mongoose");
const { userGetProductpipeline, userGetSingalsProductpipeline, userGetSingalsProductRatingpipeline } = require("../../../helper/aggretionpipeline");
const productModel = require("../../../model/product.model");
const ratingModel = require('../../../model/rating.model')
const { CustomeError } = require("../../../middleware/globelError");

exports.AllProduct = async (req, res, next) => {
    try {

        const currantpage = Number(req.query.page) || 1;
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
                page:currantpage,
                limit
            })
        );

        const products = result[0].products;

        const totalproduct = result[0].totalCount.length ? result[0].totalCount[0].total : 0;

        return res.status(200).json({
            success: true,
            message: "Get Product Successfully",
            pagination: {
                totalproduct,
                currantpage,
                limit,
                totalPages: Math.ceil(totalproduct / limit),
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
        const reviews = await ratingModel.aggregate(userGetSingalsProductRatingpipeline(id))
        return res.status(200).json({success:true,message:"get product",product,reviews})


    } catch (error) {
        return next(error)
    }
}