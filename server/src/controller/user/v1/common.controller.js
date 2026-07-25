const { default: mongoose } = require("mongoose")
const { CustomeError } = require("../../../middleware/globelError")
const couponModel = require("../../../model/coupon.model")
const cartModel = require("../../../model/cart.model")
const addressModel = require('../../../model/address.model')
const productModel = require("../../../model/product.model")
const { GetProductCouponApplay, GetCartProductCouponApplay, GetCartProductShipingcharg } = require("../../../helper/aggretionpipeline")
const { PercentageCoupenapplay, CartDiscountCoupenapplay } = require("../../../helper/helper")
const { getshippingcharg } = require("../../../services/shiproketapis")


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
                return next(CustomeError(401, discount.message))
            }
            return res.json(discount)
        }

        if (coupon.discountType === "CartDiscount") {
            const discount = await CartDiscountCoupenapplay(coupon, carts)
            if (discount.success === false) {
                return next(CustomeError(401, discount.message))
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


        const weight = products.reduce((total, product) => total + (product.shipping?.weight || 0),0);
          const data = await getshippingcharg(address.postalCode,0,weight)
         
         if(data.status === 400){
            return res.status(data.status).json({success:false,message:data.message})
         }
const bestCourier = data.data.available_courier_companies.reduce((best, current) =>
  current.rate < best.rate ? current : best
);
         return res.status(200).json({success:true,message:'get charge',shipping:bestCourier.rate,estimated_delivery_days:bestCourier.estimated_delivery_days,courier_name:bestCourier.courier_name})

    } catch (error) {
        return next(error)
    }
}