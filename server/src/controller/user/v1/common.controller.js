const { default: mongoose } = require("mongoose")
const { CustomeError } = require("../../../middleware/globelError")
const couponModel = require("../../../model/coupon.model")
const cartModel = require("../../../model/cart.model")
const addressModel = require('../../../model/address.model')
const productModel = require("../../../model/product.model")
const { GetProductCouponApplay, GetCartProductCouponApplay, GetCartProductShipingcharg, GetCartProductPaymentOrder } = require("../../../helper/aggretionpipeline")
const { PercentageCoupenapplay, CartDiscountCoupenapplay, FindPriceinProduct } = require("../../../helper/helper")
const { getshippingcharg } = require("../../../services/shiproketapis")
const { razorpay, razorpay_signature } = require("../../../config/razorpay.config")


exports.ApplyCoupon = async (req, res, next) => {
    try {
        if (!req.body?.couponCode) {
            return next(CustomeError(422, 'coupon code is require'))
        }

        if (!req.body?.cartIds.length) {
            return next(CustomeError(422, 'cartIds is require'))
        }


        const coupon = await couponModel.findOne({ couponCode: req.body.couponCode })

        if (!coupon) {
            return next(CustomeError(409, 'invalid coupon'))
        }



        if (coupon.startDate !== null && coupon.startDate > Date.now()) {
            return next(CustomeError(409, 'Coupon is not active yet.'));
        }

        if (coupon.endDate !== null && coupon.endDate < Date.now()) {
            return next(CustomeError(409, 'Coupon has expired.'));
        }

        if (coupon.status == "inactive") {
            return next(CustomeError(409, 'coupon is inactive'))
        }

        if (coupon.status == "expired") {
            return next(CustomeError(409, 'coupon is expired'))
        }


        const carts = await cartModel.aggregate(GetCartProductCouponApplay(req.body.cartIds)); // carts



        if (!carts.length) {
            return next(CustomeError(404, 'cart product not found'))
        }


        if (coupon.discountType === "Percentage") {
            const discount = await PercentageCoupenapplay(coupon, carts)
            if (discount.success === false) {
                return next(CustomeError(409, discount.message))
            }
            return res.json(discount)
        }

        if (coupon.discountType === "CartDiscount") {
            const discount = await CartDiscountCoupenapplay(coupon, carts)
            if (discount.success === false) {
                return next(CustomeError(409, discount.message))
            }
            return res.json(discount)
        }
        if (coupon.discountType === "ProductDiscount") { }
        if (coupon.discountType === "Shipping") { }

    } catch (error) {
        return next(error)
    }
}


exports.CheckShiping = async (req, res, next) => {
    try {
        if (!req.body?.addressId) {
            return next(CustomeError(422, 'address id is require'))
        }

        if (!Array.isArray(req.body?.cartIds) || req.body.cartIds.length === 0) {
            return next(CustomeError(422, "Cart ids are required"));
        }


        const address = await addressModel.findById(req.body?.addressId)
        if (!address) {
            return next(CustomeError(404, 'address not found'))
        }

        const products = await cartModel.aggregate(GetCartProductShipingcharg(req.body.cartIds));
        if (!products.length) {
            return next(CustomeError(404, 'cart product not found'))
        }




        const weight = products.reduce(
            (total, product) =>
                total +
                Number(product.shipping?.weight || 0) * Number(product.quantity || 1),
            0
        );

        const length = Math.max(
            ...products.map(
                p => Number(p.shipping?.dimensions?.length || 0)
            ),
            0
        );

        const breadth = Math.max(
            ...products.map(
                p => Number(p.shipping?.dimensions?.width || 0)
            ),
            0
        );

        const height = products.reduce(
            (total, product) =>
                total +
                Number(product.shipping?.dimensions?.height || 0) *
                Number(product.quantity || 1),
            0
        );

        const trackingData = {
            pincode: address.postalCode,
            weight,
            cod: 0,
            length,
            breadth,
            height
        };


        const data = await getshippingcharg(trackingData)
        if (data.status === 400 || data.status === 404) {
            return res.status(data.status).json({ success: false, message: data.message })
        }
        const bestCourier = data.data.available_courier_companies.reduce((best, current) =>
            current.rate < best.rate ? current : best
        );

        return res.status(200).json({ success: true, message: 'get charge', shipping: bestCourier.rate, estimated_delivery_days: bestCourier.estimated_delivery_days, courier_name: bestCourier.courier_name, id: bestCourier.courier_company_id })

    } catch (error) {
        return next(error)
    }
}



exports.PaymentOrder = async (req, res, next) => {
    try {

        if (!req.body?.cartIds && !req.body?.cartIds.length) {
            return next(CustomeError(422, 'cart id required'))
        }
        const discountData = req.body?.discountData || null
        const courierPatner = req.body.courierPatner || null
        // const carts = await cartModel.find({_id: { $in: req.body.cartIds },userId:req.user._id});
        const products = await cartModel.aggregate(GetCartProductPaymentOrder(req.body.cartIds));
        let totalprice = FindPriceinProduct(products)
        if (courierPatner) {
            totalprice += courierPatner.shipping
        }
        if (discountData) {
            totalprice -= discountData.discount
        }

        const options = {
            amount: Math.round(totalprice * 100), // paise
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`,
            notes: {
                userId: req.user._id,
                cartIds: req.body.cartIds,
                discountData: discountData,
                courierPatner: courierPatner,
                finalprice: totalprice
            }
        };

        let order = await razorpay.orders.create(options)
        const { id, ...rest } = order;
        order = {
            rzpOrderId: order.id,
            ...rest,
        }

        return res.status(200).json({ success: true, message: 'payment order created', order })


    } catch (error) {
        return next(error)
    }
}


exports.verifyPayment = async (req, res, next) => {
    try {
        if (!req.body?.razorpay_order_id) {
            return next(CustomeError(422, "razorpay_order_id is required"))
        }

        if (!req.body?.razorpay_payment_id) {
            return next(CustomeError(422, "razorpay_payment_id is required"))
        }

        if (!req.body?.razorpay_signature) {
            return next(CustomeError(422, "razorpay_signature is required"))
        }

        if (!req.body?.cartIds && !req.body?.cartIds?.length) {
            return next(CustomeError(422, 'cart id required'))
        }

        const discountData = req.body?.discountData || null
        const courierPatner = req.body.courierPatner || null

        const signature = razorpay_signature(req.body.razorpay_order_id, req.body.razorpay_payment_id)
        if (signature !== req.body?.razorpay_signature) {  // chang after

            return res.status(200).json({ success: true, message: "payment verify", signature })
        }
    } catch (error) {
        return next(error)
    }
}