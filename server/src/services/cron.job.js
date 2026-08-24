const cron = require('node-cron')
const couponModel = require('../model/coupon.model');
const bannerModel = require('../model/banner.model');

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
            // BANNER START DATE -> ACTIVE
            // Only activate if endDate is null
            // OR endDate is still in future
            // ==========================================
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
