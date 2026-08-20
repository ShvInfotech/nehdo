
const { default: mongoose } = require("mongoose");
const { userGetProductpipeline, userGetSingalsProductpipeline, userGetSingalsProductRatingpipeline } = require("../../../helper/aggretionpipeline");
const productModel = require("../../../model/product.model");
const productVariantModel = require('../../../model/productvariant.model')

const ratingModel = require('../../../model/rating.model')
const { CustomeError } = require("../../../middleware/globelError");

exports.AllProduct = async (req, res, next) => {
    try {
        const userId = req.body?.userId || null
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
                page: currantpage,
                limit,
                userId
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

exports.GetSingalProductReview = async (req, res, next) => {
    try {

        const id = req.params.id
        if (!mongoose.isValidObjectId(id)) {
            return CustomeError(422, "invalid productId")
        }


        const reviews = await ratingModel.aggregate(userGetSingalsProductRatingpipeline(id))
        return res.status(200).json({ success: true, message: "get reviews", reviews })


    } catch (error) {
        return next(error)
    }
}


exports.CreateReview = async (req, res, next) => {
    try {
        const { productIds, orderId, rating, review } = req.body || {};

        // Product IDs validation
        if (!Array.isArray(productIds) ||productIds.length === 0) {
            return next(
                CustomeError(422, "product id is required")
            );
        }

        // Order ID validation
        if (!orderId) {
            return next(
                CustomeError(422, "order id is required")
            );
        }

        // Rating validation
        if (!rating) {
            return next(
                CustomeError(422, "product rating is required")
            );
        }

        // Review validation
        if (!review?.trim()) {
            return next(
                CustomeError(422, "product review is required")
            );
        }

        // Remove duplicate product IDs
        const uniqueProductIds = [
            ...new Set(productIds.map(String))
        ];

        const reviews = [];

        for (const productId of uniqueProductIds) {

            const existingReview = await ratingModel.findOne({
                userId: req.user._id,
                orderId: orderId,
                productId: productId
            });

            if (existingReview) {

                // Existing review -> UPDATE
                existingReview.rating = rating;
                existingReview.review = review;

                await existingReview.save();

                reviews.push(existingReview);

            } else {

                // New product review -> CREATE
                const newReview = await ratingModel.create({
                    userId: req.user._id,
                    orderId: orderId,
                    productId: productId,
                    rating,
                    review
                });

                reviews.push(newReview);
            }
        }

        return res.status(200).json({
            success: true,
            message: "Review submitted successfully",
            reviews
        });

    } catch (error) {
        return next(error);
    }
};