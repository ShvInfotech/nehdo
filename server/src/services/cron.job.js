const cron = require('node-cron')
const couponModel = require('../model/coupon.model');
const bannerModel = require('../model/banner.model');




const promoModel = require("../model/promo.model");
// cron.schedule("* * * * *"
cron.schedule("0 0 * * *",async () => {
        try {
            const now = new Date();

            // ==========================================
            // COUPON EXPIRY
            // ==========================================
            const expiredCoupons = await couponModel.updateMany(
                {
                    endDate: {
                        $ne: null,
                        $lte: now,
                    },

                    status: "active",
                },
                {
                    $set: {
                        status: "expired",
                    },
                }
            );

            // ==========================================
            // BANNER END DATE -> INACTIVE
            // ==========================================
            const expiredBanners = await bannerModel.updateMany(
                {
                    endDate: {
                        $ne: null,
                        $lte: now,
                    },

                    status: {
                        $in: ["Active", "Scheduled"],
                    },

                    isDeleted: false,
                },
                {
                    $set: {
                        status: "Inactive",
                    },
                }
            );

            // ==========================================
            // PROMO END DATE -> INACTIVE
            // ==========================================
            const expiredPromos = await promoModel.updateMany(
                {
                    endDate: {
                        $ne: null,
                        $lte: now,
                    },

                    status: {
                        $in: ["Active", "Scheduled"],
                    },
                },
                {
                    $set: {
                        status: "Inactive",
                    },
                }
            );


            const activeBanners = await bannerModel.updateMany(
                {
                    startDate: {
                        $ne: null,
                        $lte: now,
                    },

                    status: "Scheduled",

                    isDeleted: false,

                    $or: [
                        {
                            endDate: null,
                        },
                        {
                            endDate: {
                                $gt: now,
                            },
                        },
                    ],
                },
                {
                    $set: {
                        status: "Active",
                    },
                }
            );

    
            const activePromos = await promoModel.updateMany(
                {
                    startDate: {
                        $ne: null,
                        $lte: now,
                    },

                    status: "Scheduled",

                    $or: [
                        {
                            endDate: null,
                        },
                        {
                            endDate: {
                                $gt: now,
                            },
                        },
                    ],
                },
                {
                    $set: {
                        status: "Active",
                    },
                }
            );

            console.log("=================================");
            console.log("Cron executed:", now);
            console.log(
                `Coupons expired: ${expiredCoupons.modifiedCount}`
            );
            console.log(
                `Banners activated: ${activeBanners.modifiedCount}`
            );
            console.log(
                `Banners inactivated: ${expiredBanners.modifiedCount}`
            );
            console.log(
                `Promos activated: ${activePromos.modifiedCount}`
            );
            console.log(
                `Promos inactivated: ${expiredPromos.modifiedCount}`
            );
            console.log("=================================");

        } catch (error) {
            console.error("Cron job error:", error);
        }
    },
    {
        timezone: "Asia/Kolkata",
    }
);




module.exports = cron;
