
const Order = require("../../../model/order.model");
const User = require("../../../model/user.model");
const Product = require("../../../model/product.model");

const getDateRange = (range, customStartDate, customEndDate) => {
    const now = new Date();
    let startDate;
    let endDate;

    if (customStartDate && customEndDate) {
        startDate = new Date(customStartDate);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(customEndDate);
        endDate.setHours(23, 59, 59, 999);
        return {startDate,endDate,range: "custom",};
    }

    switch (range) {
        case "today": {
            startDate = new Date(now);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(now);
            endDate.setHours(23, 59, 59, 999);
            break;
        }
        case "7d": {
            endDate = new Date(now);
            endDate.setHours(23, 59, 59, 999);
            startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 6);
            startDate.setHours(0, 0, 0, 0);
            break;
        }
        case "30d": {
            endDate = new Date(now);
            endDate.setHours(23, 59, 59, 999);
            startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 29);
            startDate.setHours(0, 0, 0, 0);
            break;
        }
        case "90d": {
            endDate = new Date(now);
            endDate.setHours(23, 59, 59, 999);
            startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 89);
            startDate.setHours(0, 0, 0, 0);
            break;
        }
        case "year": {
            startDate = new Date(now.getFullYear(),0,1);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(now);
            endDate.setHours(23, 59, 59, 999);
            break;
        }
        default: {
            endDate = new Date(now);
            endDate.setHours(23, 59, 59, 999);
            startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 6);
            startDate.setHours(0, 0, 0, 0);
            range = "7d";
            break;
        }
    }

    return {
        startDate,
        endDate,
        range,
    };
};


exports.getAdminDashboard = async (req, res, next) => {
    try {
        const range = String(req.query.range || "today").toLowerCase();
        const now = new Date();
        let startDate;
        let endDate;

        switch (range) {
            case "today": {
                startDate = new Date(now);
                startDate.setHours(0, 0, 0, 0);

                endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 1);
                break;
            }
            case "yesterday": {
                endDate = new Date(now);
                endDate.setHours(0, 0, 0, 0);
                startDate = new Date(endDate);
                startDate.setDate(startDate.getDate() - 1);
                break;
            }
            case "last7days": {
                endDate = new Date(now);
                endDate.setDate(endDate.getDate() + 1);
                endDate.setHours(0, 0, 0, 0);
                startDate = new Date(endDate);
                startDate.setDate(startDate.getDate() - 7);
                break;
            }
            case "last30days": {
                endDate = new Date(now);
                endDate.setDate(endDate.getDate() + 1);
                endDate.setHours(0, 0, 0, 0);
                startDate = new Date(endDate);
                startDate.setDate(startDate.getDate() - 30);
                break;
            }
            default: {
                startDate = new Date(now);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 1);
                break;
            }
        }

      

        const orderDateFilter = {createdAt: {$gte: startDate,$lt: endDate,},status: {$ne: "cancelled",},};

        const totalOrders = await Order.countDocuments(orderDateFilter);

        const revenueResult = await Order.aggregate([
            {$match: orderDateFilter},
            {$group: {_id: null,totalRevenue: {$sum: "$totalAmount",},},},
        ]);

        const totalRevenue = revenueResult.length > 0 ? Number(revenueResult[0].totalRevenue || 0) : 0;

        const newCustomers = await User.countDocuments({role: "user",status: {$ne: "block",},createdAt: {$gte: startDate,$lt: endDate,}});

        const activeVisitors = null;

        let revenueAnalytics = [];

        if ( range === "today" || range === "yesterday" ) {
            revenueAnalytics = await Order.aggregate([
                {$match: orderDateFilter},

                {
                    $group: {_id: {$hour: "$createdAt",},revenue: {$sum: "$totalAmount",},},
                },
                {
                    $sort: {"_id": 1,},
                },

                {
                    $project: {
                        _id: 0,
                        hour: "$_id",
                        revenue: {$round: ["$revenue",2,],},
                    },
                },
            ]);

            revenueAnalytics = revenueAnalytics.map((item) => ({label: `${item.hour}:00`,revenue: Number(item.revenue || 0),}));
        }
        else {
            revenueAnalytics = await Order.aggregate([
                {$match: orderDateFilter,},
                {
                    $group: {
                        _id: {$dateToString: {format: "%Y-%m-%d",date: "$createdAt",},},
                        revenue: {$sum: "$totalAmount",},
                    },
                },
                {$sort: {"_id": 1,}},
                {
                    $project: {
                        _id: 0,
                        date: "$_id",
                        revenue: {$round: ["$revenue",2,],},
                    },
                },
            ]);
            revenueAnalytics = revenueAnalytics.map((item) => ({label: item.date,revenue: Number(item.revenue || 0),}));
        
        }

        const topProducts = await Order.aggregate([
            {$match: orderDateFilter,},
            {$unwind: "$items",},
            {
                $group: {
                    _id: "$items.productId",
                    sales: {$sum: "$items.quantity",},
                    revenue: {$sum: "$items.total",},
                },
            },
            {$sort: {sales: -1,},},
            {$limit: 5,},
        ]);

        const productIds = topProducts.map((item) => item._id).filter(Boolean);
        let products = [];

        if (productIds.length > 0) {
            products = await Product.find({_id: {$in: productIds,},}).select("_id name productImage salePrice").lean();
        }

        const topProductsData = topProducts.map(
            (item) => {
                const product = products.find((p) =>String(p._id) ===String(item._id));
                return {
                    productId: item._id,
                    name:product?.name ||"Unknown Product",
                    image: product?.productImage?.[0]? `http://${process.env.HOST}:${process.env.PORT}${product.productImage[0]}`: "",
                    sales: Number(item.sales || 0),
                    revenue: Number(item.revenue || 0),
                };
            }
        );

        const recentOrders = await Order.find({}).populate("userId","name email").sort({createdAt: -1,}).limit(10).lean();


        const formattedRecentOrders = recentOrders.map((order) => ({
                id: order.orderNumber,
                orderId: order._id,
                customer:order.userId?.name || "Unknown Customer",
                email:order.userId?.email || "",
                date: order.createdAt,
                status: order.status,
                total: Number(order.totalAmount || 0
                ),
            }));


        return res.status(200).json({
            success: true,
            message:"Dashboard data fetched successfully",
            range,
            dashboard: {
                totalRevenue,
                totalOrders,
                newCustomers,
                activeVisitors,
                revenueAnalytics,
                topProducts:topProductsData,
                recentOrders:formattedRecentOrders,
            },
        });
    } catch (error) {
       return next(error)
    }
};

exports.getAdminReports = async (req, res, next) => {
    try {
        let { range = "7d", startDate: customStartDate, endDate: customEndDate, } = req.query;

        const dateData = getDateRange(range, customStartDate, customEndDate);

        const { startDate, endDate, range: selectedRange, } = dateData;


        const orderFilter = { createdAt: { $gte: startDate, $lte: endDate, }, status: { $ne: "cancelled", }, };

        const overviewData = await Order.aggregate([
            { $match: orderFilter },
            { $group: { _id: null, totalRevenue: { $sum: "$totalAmount", }, totalOrders: { $sum: 1, }, } }
        ]);

        const totalRevenue = overviewData[0]?.totalRevenue || 0;

        const totalOrders = overviewData[0]?.totalOrders || 0;

        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;


        const salesReport = await Order.aggregate([
            { $match: orderFilter, },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", }, },
                    orders: { $sum: 1, },
                    grossSales: { $sum: "$subtotal", },
                    discounts: { $sum: "$discount", },
                    shipping: { $sum: "$shippingCharge", },
                    netRevenue: { $sum: "$totalAmount", },
                },
            },
            { $sort: { _id: 1, }, },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    orders: 1,
                    grossSales: { $round: ["$grossSales", 2,], },
                    discounts: { $round: ["$discounts", 2,], },
                    shipping: { $round: ["$shipping", 2,], },
                    netRevenue: { $round: ["$netRevenue", 2,], },
                },
            },
        ]);


        const salesChart = salesReport.map((item) => ({label: item.date,revenue: item.netRevenue,orders: item.orders,}));

        const productPerformance = await Order.aggregate([
            {$match: orderFilter,},
            {$unwind: "$items",},
            {
                $group: {_id: "$items.productId",
                    image: {$first: "$items.image",},
                    unitsSold: {$sum: "$items.quantity",},
                    revenue: {$sum: "$items.total",},
                },
            },
            {$sort: {revenue: -1,},},
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productData",
                }
            },
            {$unwind: {path: "$productData",preserveNullAndEmptyArrays: true}},

            {
                $lookup: {
                    from: "ratings",
                    let: {productId: "$_id",},
                    pipeline: [
                        {
                        $match: {$expr: {$and: [{$eq: ["$productId","$$productId",],},{$eq: ["$status","approved",],},],},}
                        },
                        {$group: {_id: null,averageRating: {$avg: "$rating",},},},
                    ],
                    as: "ratingData",
                },
            },
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    name: "$productData.name",
                    image: {$cond: [{$and: [{$ne: ["$image",null,]},{$ne: ["$image",""]}]},{$concat: [`http://${process.env.HOST}:${process.env.PORT}`,"$image",],},null,]},
                    unitsSold: 1,
                    revenue: {$round: ["$revenue",2,],},
                    averageRating: {$round: [{$ifNull: [{$arrayElemAt: ["$ratingData.averageRating",0,],},0,],},2,],},
                },
            },
        ]);


        const totalCustomers =await User.countDocuments({role: "user"});
        const newCustomers =await User.countDocuments({role: "user",createdAt: {$gte: startDate,$lte: endDate}});

        const customerOrders =
            await Order.aggregate([
                {$match: {status: {$ne: "cancelled"}}},
                {$group: {_id: "$userId",totalOrders: {$sum: 1,},totalSpent: {$sum: "$totalAmount",},},},
            ]);

        const repeatCustomers = customerOrders.filter((customer) =>customer.totalOrders >= 2).length;
        const customersWithOrders = customerOrders.length;
        const repeatRate =customersWithOrders > 0? (repeatCustomers /customersWithOrders) * 100: 0;
        const totalCustomerRevenue = customerOrders.reduce( (total, customer) => total + customer.totalSpent, 0 );
        const averageCLV = customersWithOrders > 0 ? totalCustomerRevenue / customersWithOrders : 0;
        const vipCustomers = customerOrders.filter( (customer) => customer.totalOrders >= 10 );
        const regularCustomers = customerOrders.filter( (customer) => customer.totalOrders >= 3 && customer.totalOrders <= 9 );
        const newOrderCustomers =customerOrders.filter((customer) =>customer.totalOrders >= 1 &&customer.totalOrders <= 2);
        const totalRevenueAllCustomers =totalCustomerRevenue || 0;


        const createSegment = (customers,segmentName) => {
            const count = customers.length;
            const revenue = customers.reduce( (total, customer) => total + customer.totalSpent, 0 );
            const averageOrders = count > 0 ? customers.reduce( (total, customer) => total + customer.totalOrders, 0 ) / count : 0;
            return {
                segment: segmentName,
                count,
                revenueShare: totalRevenueAllCustomers > 0 ? ( revenue / totalRevenueAllCustomers ) * 100 : 0,
                averageOrders,
            };
        };


        const customerSegments = [
            createSegment(vipCustomers,"VIP (10+ orders)"),
            createSegment(regularCustomers,"Regular (3-9 orders)"),
            createSegment(newOrderCustomers,"New (1-2 orders)"),
        ];


        return res.status(200).json({
            success: true,
            message:"Reports data fetched successfully",
            range: selectedRange,
            startDate,
            endDate,
            reports: {
                overview: {
                    totalRevenue: Number(totalRevenue.toFixed(2)),
                    totalOrders,
                    averageOrderValue: Number(averageOrderValue.toFixed(2)),
                },
                sales: {chart: salesChart,table: salesReport,},
                products: productPerformance.map((product) => ({...product,averageRating: Number(Number(product.averageRating).toFixed(1))})),
                customers: {
                    totalCustomers,
                    newCustomers,
                    repeatRate: Number(repeatRate.toFixed(2)),
                    averageCLV: Number(averageCLV.toFixed(2)),
                    segments:
                        customerSegments.map(
                            (segment) => ({
                                ...segment,
                                revenueShare: Number(segment.revenueShare.toFixed(2)),
                                averageOrders: Number(segment.averageOrders.toFixed(1))
                            })
                        ),
                },
            },
        });
    } catch (error) {
        next(error)
    }
};