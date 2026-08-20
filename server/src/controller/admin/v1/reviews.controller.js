const { CustomeError } = require("../../../middleware/globelError");
const ratingModel = require("../../../model/rating.model")

exports.GetReviews = async (req, res, next) => {
    try {

        const result = await ratingModel.aggregate([
            {
                $facet: {

                    // =========================
                    // ALL REVIEWS
                    // =========================
                    reviews: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "userId",
                                foreignField: "_id",
                                as: "user"
                            }
                        },
                        {
                            $lookup: {
                                from: "products",
                                localField: "productId",
                                foreignField: "_id",
                                as: "product"
                            }
                        },
                        {
                            $unwind: {
                                path: "$user",
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        {
                            $unwind: {
                                path: "$product",
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                userId: 1,
                                orderId: 1,
                                productId: 1,

                                userName: "$user.name",
                                productName: "$product.name",

                                rating: 1,
                                review: 1,
                                status: 1,
                                reply: 1,
                                createdAt: 1,
                                updatedAt: 1
                            }
                        },
                        {
                            $sort: {
                                createdAt: -1
                            }
                        }
                    ],

                    // =========================
                    // RATING COUNTS
                    // =========================
                    ratingCounts: [
                        {
                            $group: {
                                _id: "$rating",
                                count: { $sum: 1 }
                            }
                        }
                    ],

                    // =========================
                    // STATUS COUNTS
                    // =========================
                    statusCounts: [
                        {
                            $group: {
                                _id: "$status",
                                count: { $sum: 1 }
                            }
                        }
                    ],

                    // =========================
                    // AVERAGE + TOTAL
                    // =========================
                    ratingStats: [
                        {
                            $group: {
                                _id: null,
                                totalReviews: { $sum: 1 },
                                averageRating: { $avg: "$rating" }
                            }
                        }
                    ]
                }
            }
        ]);

        const data = result[0];

        // =========================
        // RATING SUMMARY
        // =========================

        const ratingSummary = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
        };

        data.ratingCounts.forEach(item => {
            ratingSummary[item._id] = item.count;
        });


        // =========================
        // STATUS SUMMARY
        // =========================

        const statusSummary = {
            pending: 0,
            approved: 0,
            rejected: 0
        };

        data.statusCounts.forEach(item => {
            if (item._id) {
                statusSummary[item._id] = item.count;
            }
        });


        // =========================
        // RATING STATS
        // =========================

        const totalReviews =
            data.ratingStats[0]?.totalReviews || 0;

        const averageRating =
            data.ratingStats[0]?.averageRating || 0;


        return res.status(200).json({
            success: true,
            message: "get reviews",

            // Overall rating
            averageRating: Number(averageRating.toFixed(1)),

            // Total reviews
            totalReviews,

            // 5,4,3,2,1 rating counts
            ratingSummary,

            // pending, approved, rejected counts
            statusSummary,

            // Reviews list
            reviews: data.reviews
        });

    } catch (error) {
        return next(error);
    }
};


exports.UpdateReviews = async(req,res,next) =>{
    try {
        const id  = req.params.id
           const rating = await ratingModel.findByIdAndUpdate(id,{...req.body})
           if(!rating){
           return next(CustomeError(404,"Review Not Found"))
           }
        return res.status(200).json({success:true,message:'Review Updated',rating})
    } catch (error) {
        return next(error)
    }
}


exports.DeleteReviews = async(req,res,next)=>{
    try {
         const id  = req.params.id
           const rating = await ratingModel.findByIdAndDelete(id)
           if(!rating){
           return next(CustomeError(404,"Review Not Found"))
           }
        return res.status(200).json({success:true,message:'Review Deleted'})
    } catch (error) {
        
    }
}



exports.ApproveAllReviews = async (req, res, next) => {
    try {
        const result = await ratingModel.updateMany(
            {
                status: "pending"
            },
            {
                $set: {
                    status: "approved",
                    updatedAt: new Date()
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: "All pending reviews approved successfully",
            modifiedCount: result.modifiedCount
        });

    } catch (error) {
        return next(error);
    }
};