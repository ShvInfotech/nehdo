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
                productImage: {
                    $map: {
                        input: {
                            $ifNull: ["$productImage", []]
                        },
                        as: "image",
                        in: {
                            $concat: [
                                `http://${process.env.HOST}:${process.env.PORT}`,
                                "$$image"
                            ]
                        }
                    }
                },


                category: "$category.name",
                subcategory: "$subcategory.name",
                brand: "$brand.name",

                size: "$variant.size",
                color: "$variant.colorOptions",

                rating: {
                    $size: "$ratings"
                },

                averageRating: {
                    $cond: {
                        if: { $gt: [{ $size: "$ratings" }, 0] },
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
        }
    ];
}