const couponModel = require("../../../model/coupon.model")
const { CustomeError } = require("../../../middleware/globelError")


exports.AddCoupon = async (req, res, next) => {
    try {
        if (!req.body?.couponCode) {
            return next(CustomeError(422, "couponcode is require"))
        }
        if (!req.body?.discountType) {
            return next(CustomeError(422, "discount type is require"))
        }

        const coupon = await couponModel.create({ ...req.body })
        return res.status(200).json({ success: true, message: "coupon created", coupon })
    } catch (error) {
        return next(error)
    }
}


exports.GetCoupon = async (req, res, next) => {
    try {
        const coupons = await couponModel.aggregate([
            {
                $lookup: {
                    from: "orders",
                    let: { couponId: "$_id" },
                    pipeline: [
                        {
                            $match: { $expr: { $eq: ["$couponId", "$$couponId"] } }
                        },
                        { $project: { _id: 1, discount: 1 } }
                    ],
                    as: "couponOrders"
                }
            },

            {
                $addFields: {
                    usedCount: { $size: "$couponOrders" },
                    totalDiscount: { $sum: "$couponOrders.discount" }
                }
            },

            {
                $project: {
                    couponOrders: 0
                }
            }
        ]);

        const totalRedemptions = coupons.reduce((total, coupon) => total + coupon.usedCount, 0);
        const totalRevenueLost = coupons.reduce((total, coupon) => total + coupon.totalDiscount, 0);

        return res.status(200).json({ success: true, message: "get coupon", coupons, totalRedemptions, totalRevenueLost });

    } catch (error) {
        return next(error);
    }
};


exports.UpdateCoupon = async (req, res, next) => {
    try {
        const coupon = await couponModel.findByIdAndUpdate(req.params.id, { ...req.body }, { returnDocument: 'after' });
        if (!coupon) {
            return next(CustomeError(404, 'Coupon not found'));
        }

        return res.status(200).json({ success: true, message: 'coupon updated', coupon });
    } catch (error) {
        return next(error);
    }
};