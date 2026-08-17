const { default: mongoose } = require("mongoose")
const { CustomeError } = require("../../../middleware/globelError")
const couponModel = require("../../../model/coupon.model")
const cartModel = require("../../../model/cart.model")
const addressModel = require('../../../model/address.model')
const productModel = require("../../../model/product.model")
const productvariantModel = require('../../../model/productvariant.model')
const { GetProductCouponApplay, GetCartProductCouponApplay, GetCartProductShipingcharg, GetCartProductPaymentOrder } = require("../../../helper/aggretionpipeline")
const { PercentageCoupenapplay, CartDiscountCoupenapplay, FindPriceinProduct, generateOrderNumber } = require("../../../helper/helper")
const { getshippingcharg } = require("../../../services/shiproketapis")
const { razorpay, razorpaySignature } = require("../../../config/razorpay.config")
const orderModel = require("../../../model/order.model")



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
        const discount = req.body?.discount || null
        const shippingcharge = req.body.shippingcharge || null
        const products = await cartModel.aggregate(GetCartProductPaymentOrder(req.body.cartIds));
        let totalprice = FindPriceinProduct(products)
        if (shippingcharge) {
            totalprice += shippingcharge
        }
        if (discount) {
            totalprice -= discount
        }

        const options = {
            amount: Math.round(totalprice * 100), // paise
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`
        };

        let order = await razorpay.orders.create(options)

        console.log(order)

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



        const signature = razorpaySignature(req.body.razorpay_order_id, req.body.razorpay_payment_id)
        if (signature !== req.body?.razorpay_signature) {  // chang after
            return res.status(409).json({ success: false, message: "payment not verify" })
        }





        const address = await addressModel.findById(req.body?.addressId)
        const carts = await cartModel.find({
            _id: { $in: req.body?.cartIds },
            userId: req.user._id
        });

        const orderItems = [];

        for (const cartItem of carts) {

            // 1. Product na variants find karo
            const productVariant = await productvariantModel.findOne({
                productId: cartItem.productId
            });

            if (!productVariant) {
                return res.status(404).json({
                    success: false,
                    message: `Variant not found for product ${cartItem.productId}`
                });
            }

            // 2. Size + Color combination
            const variantName = `${cartItem.color}/${cartItem.size}`;

            // 3. Actual variant find karo
            const selectedVariant = productVariant.variant.find(
                (variant) => variant.name === variantName
            );

            if (!selectedVariant) {
                return res.status(404).json({
                    success: false,
                    message: `Variant ${variantName} not found`
                });
            }

            console.log("Selected Variant:", selectedVariant);

            // 4. Order item
            orderItems.push({
                productId: cartItem.productId,
                variantId: selectedVariant._id,

                size: cartItem.size,
                color: cartItem.color,

                quantity: cartItem.quantity,

                price: selectedVariant.price,

                total: selectedVariant.price * cartItem.quantity
            });
        }

        const shippingAddress = {
            addressline: address.addressline,
            landmark: address.landmark,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
        }

        const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
        const discount = req.body?.discount || 0
        const couponId = req.body?.coupenId || null
        const shipping = req.body?.shipping || 0
        
        const totalAmount = subtotal + shipping - discount
        const payment = {
            orderId: req.body.razorpay_order_id,
            paymentId: req.body.razorpay_payment_id,
        }

        const orderNumber = await generateOrderNumber()
        const orderData = {
            userId: req.user._id,
            orderNumber,
            items: orderItems,
            shippingAddress,
            subtotal,
            shippingCharge: shipping,
            discount,
            couponId,
            totalAmount,
            payment,
        }

        const order = await orderModel.create(orderData)

        if (order) {
            await cartModel.deleteMany({
                _id: { $in: req.body?.cartIds },
                userId: req.user._id
            });
        }
        return res.status(200).json({ success: true, message: 'order create successfullly', order })
    } catch (error) {
        return next(error)
    }
}