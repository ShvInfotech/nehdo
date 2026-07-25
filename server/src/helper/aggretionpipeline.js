const mongoose = require("mongoose");


exports.getproductspipeline = () => {
    return [
        {
            $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "subcategories",
                localField: "subcategoryId",
                foreignField: "_id",
                as: "subcategory"
            }
        },
        {
            $unwind: {
                path: "$subcategory",
                preserveNullAndEmptyArrays: true
            }
        },

        {
            $lookup: {
                from: "brands",
                localField: "brandId",
                foreignField: "_id",
                as: "brand"
            }
        },
        {
            $unwind: {
                path: "$brand",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "productinventorys",
                localField: "_id",
                foreignField: "productId",
                as: "inventory"
            }
        },
        {
            $unwind: {
                path: "$inventory",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                name: 1,
                price: 1,
                salePrice: 1,
                sku: 1,
                productImage: 1,
                // productImage: { $ifNull: [{ $arrayElemAt: ["$productImage", 0] }, ""] },
                status: 1,
                slug: 1,
                stock: "$inventory.stock",
                category: "$category.name",
                subcategory: "$subcategory.name",
                brand: "$brand.name"
            }
        }
    ];
}


exports.getproductslugpipeline = (slug) => {
    return [
        {
            $match: {
                slug: slug
            }
        },
        {
            $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "subcategories",
                localField: "subcategoryId",
                foreignField: "_id",
                as: "subcategory"
            }
        },
        {
            $unwind: {
                path: "$subcategory",
                preserveNullAndEmptyArrays: true
            }
        },

        {
            $lookup: {
                from: "brands",
                localField: "brandId",
                foreignField: "_id",
                as: "brand"
            }
        },
        {
            $unwind: {
                path: "$brand",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "productinventorys",
                localField: "_id",
                foreignField: "productId",
                as: "inventory"
            }
        },
        {
            $unwind: {
                path: "$inventory",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "productvariants",
                localField: "_id",
                foreignField: "productId",
                as: "variant"
            }
        },
        {
            $unwind: {
                path: "$variant",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                name: 1,
                price: 1,
                salePrice: 1,
                productImage: 1,
                status: 1,
                flags: 1,
                stock: "$inventory.stock",
                category: "$category.name",
                subcategory: "$subcategory.name",
                brand: "$brand.name",
                size: "$variant.size",
                color: "$variant.colorOptions"
            }
        }
    ];
}







exports.userGetProductpipeline = ({
    search = "",
    categoryId = "",
    subcategoryId = "",
    brandId = "",
    minPrice = "",
    maxPrice = "",
    rating = "",
    sort = { createdAt: -1 },
    page = 1,
    limit = 10
} = {}) => {

    const pipeline = [];

    //====================================
    // Match
    //====================================

    const match = {
        status: "Active",
        visibility: "visible"
    };

    if (categoryId) {
        match.categoryId = new mongoose.Types.ObjectId(categoryId);
    }

    if (subcategoryId) {
        match.subcategoryId = new mongoose.Types.ObjectId(subcategoryId);
    }

    if (brandId) {
        match.brandId = new mongoose.Types.ObjectId(brandId);
    }

    if (search) {
        match.name = {
            $regex: search,
            $options: "i"
        };
    }

    if (minPrice || maxPrice) {

        match.salePrice = {};

        if (minPrice) {
            match.salePrice.$gte = Number(minPrice);
        }

        if (maxPrice) {
            match.salePrice.$lte = Number(maxPrice);
        }

    }

    pipeline.push({
        $match: match
    });

    //====================================
    // Category
    //====================================

    pipeline.push(
        {
            $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
            }
        }
    );

    //====================================
    // Sub Category
    //====================================

    pipeline.push(
        {
            $lookup: {
                from: "subcategories",
                localField: "subcategoryId",
                foreignField: "_id",
                as: "subcategory"
            }
        },
        {
            $unwind: {
                path: "$subcategory",
                preserveNullAndEmptyArrays: true
            }
        }
    );

    //====================================
    // Brand
    //====================================

    pipeline.push(
        {
            $lookup: {
                from: "brands",
                localField: "brandId",
                foreignField: "_id",
                as: "brand"
            }
        },
        {
            $unwind: {
                path: "$brand",
                preserveNullAndEmptyArrays: true
            }
        }
    );

    //====================================
    // Ratings
    //====================================

    pipeline.push({
        $lookup: {
            from: "ratings",
            localField: "_id",
            foreignField: "productId",
            as: "ratings"
        }
    });

    pipeline.push({
        $lookup: {
            from: "productvariants",
            localField: "_id",
            foreignField: "productId",
            as: "variant"
        }
    },
        {
            $unwind: {
                path: "$variant",
                preserveNullAndEmptyArrays: true
            }
        }
    );
    //====================================
    // Project
    //====================================

    pipeline.push({
        $project: {

            name: 1,
            price: 1,
            salePrice: 1,
            flags: 1,

            productImage: {
                $cond: {
                    if: {
                        $gt: [
                            {
                                $size: "$productImage"
                            },
                            0
                        ]
                    },
                    then: {
                        $concat: [
                            `http://${process.env.HOST}:${process.env.PORT}`,
                            {
                                $arrayElemAt: [
                                    "$productImage",
                                    0
                                ]
                            }
                        ]
                    },
                    else: ""
                }
            },
            category: "$category.name",
            subcategory: "$subcategory.name",
            brand: "$brand.name",
            size: "$variant.size",
            colors: "$variant.colorOptions",
            totalCustomerRating: {
                $size: "$ratings"
            },

            averageRating: {
                $cond: {
                    if: {
                        $gt: [
                            {
                                $size: "$ratings"
                            },
                            0
                        ]
                    },
                    then: {
                        $round: [
                            {
                                $avg: "$ratings.rating"
                            },
                            1
                        ]
                    },
                    else: 0
                }
            }

        }
    });

    //====================================
    // Rating Filter
    //====================================

    if (rating) {
        pipeline.push({
            $match: {
                averageRating: {
                    $gte: Number(rating)
                }
            }
        });
    }

    //====================================
    // Facet (Pagination + Count)
    //====================================

    pipeline.push({
        $facet: {

            products: [

                {
                    $sort: sort
                },

                {
                    $skip: (Number(page) - 1) * Number(limit)
                },

                {
                    $limit: Number(limit)
                }

            ],

            totalCount: [

                {
                    $count: "total"
                }

            ]

        }
    });

    return pipeline;
};




exports.userGetSingalsProductpipeline = (id) => {
    return [
        {
            $match: {
                status: "Active",
                visibility: "visible",
                _id: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                from: "productvariants",
                localField: "_id",
                foreignField: "productId",
                as: "variant"
            }
        },
        {
            $unwind: {
                path: "$variant",
                preserveNullAndEmptyArrays: true
            }
        },

        {
            $lookup: {
                from: "brands",
                localField: "brandId",
                foreignField: "_id",
                as: "brand"
            }
        },
        {
            $unwind: {
                path: "$brand",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "ratings",
                localField: "_id",
                foreignField: "productId",
                as: "ratings"
            }
        },
        {
            $project: {
                name: 1,
                price: 1,
                salePrice: 1,
                longDescription: 1,
                shortDescription: 1,
                productImage: { $map: { input: { $ifNull: ["$productImage", []] }, as: "image", in: { $concat: [`http://${process.env.HOST}:${process.env.PORT}`, "$$image"] } } },
                category: "$category.name",
                subcategory: "$subcategory.name",
                brand: "$brand.name",
                size: "$variant.size",
                color: "$variant.colorOptions",
                rating: { $size: "$ratings" },
                averageRating: {
                    $cond: { if: { $gt: [{ $size: "$ratings" }, 0] }, then: { $round: [{ $avg: "$ratings.rating" }, 1] }, else: 0 }
                }
            }
        }
    ];
}


exports.userGetSingalsProductRatingpipeline = (id) => {
    return [
        {
            $match: {
                productId: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 1,
                rating: 1,
                review: 1,
                createdAt: 1,
                userName: "$user.name",
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ];
};


exports.GetCartPipeline = (id) => {
    return [
        {
            $match: {
                userId: id
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
                path: "$product",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "brands",
                localField: "product.brandId",
                foreignField: "_id",
                as: "brand"
            }
        },
        {
            $unwind: {
                path: "$brand",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 1,
                quantity: 1,
                color: 1,
                size: 1,
                productName: "$product.name",
                price: "$product.salePrice",
                brand: "$brand.name",
                productImage: { $concat: [`http://${process.env.HOST}:${process.env.PORT}`, { $ifNull: [{ $arrayElemAt: ["$product.productImage", 0] }, ""] }] }
            }
        }

    ]
}



exports.GetWishlistpipiline = (userId) => {
    return [
        {
            $match: {
                userId: userId
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
                path: "$product",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "brands",
                localField: "product.brandId",
                foreignField: "_id",
                as: "brand"
            }
        },
        {
            $unwind: {
                path: "$brand",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: "ratings",
                localField: "product._id",
                foreignField: "productId",
                as: "ratings"
            }
        },
        {
            $project: {
                _id: 1,
                productId:"$product._id",
                productname: "$product.name",
                brandname: "$brand.name",
                falgs:"$product.flags",
                productImage: { $concat: [`http://${process.env.HOST}:${process.env.PORT}`, { $ifNull: [{ $arrayElemAt: ["$product.productImage", 0] }, ""] }] },
                averageRating: {
                    $cond: { if: { $gt: [{ $size: "$ratings" }, 0] }, then: { $round: [{ $avg: "$ratings.rating" }, 1] }, else: 0 }
                }

            }
        }
    ]
}


exports.GetCartProductCouponApplay =(cartIds)=>{
    return[
         {
        $match: {
            _id: {
                $in: cartIds.map(id => new mongoose.Types.ObjectId(id))
            }
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
        $unwind: "$product"
    },
    {
            $lookup: {
                from: "productvariants",
                localField: "product._id",
                foreignField: "productId",
                as: "variant"
            }
        },
        {
            $unwind: {
                path: "$variant",
                preserveNullAndEmptyArrays: true
            }
        },
    ]
}


exports.GetCartProductShipingcharg =(cartIds)=>{
    return[
         {
        $match: {
            _id: {
                $in: cartIds.map(id => new mongoose.Types.ObjectId(id))
            }
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
        $unwind: "$product"
    },
    {
            $lookup: {
                from: "productshippings",
                localField: "product._id",
                foreignField: "productId",
                as: "shipping"
            }
        },
        {
            $unwind: {
                path: "$shipping",
                preserveNullAndEmptyArrays: true
            }
        },
    ]
}

exports.GetProductCouponApplay = (productId)=>{
    return [
         {
            $match: {
                _id: new mongoose.Types.ObjectId(productId)
            }
        },
         {
            $lookup: {
                from: "productvariants",
                localField: "_id",
                foreignField: "productId",
                as: "variant"
            }
        },
        {
            $unwind: {
                path: "$variant",
                preserveNullAndEmptyArrays: true
            }
        },
    ]
}



















