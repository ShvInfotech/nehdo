const { CustomeError } = require("../../../middleware/globelError")
const couponModel = require("../../../model/coupon.model")
const cartModel = require("../../../model/cart.model")
const addressModel = require('../../../model/address.model')
const productModel = require("../../../model/product.model")
const productvariantModel = require('../../../model/productvariant.model')
const productshippingModel = require('../../../model/productshipping.model')
const productinventoryModel = require('../../../model/productinventory.model')
const orderModel = require("../../../model/order.model")
const categoryModel = require('../../../model/category.model')
const brandModel = require('../../../model/brand.model')
const bannerModel = require('../../../model/banner.model')
const promoModel = require("../../../model/promo.model");
const sendEmail = require("../../../config/nodemailer.confing")
const { getshippingcharg } = require("../../../services/shiproketapis")
const { OrderConfirmationMail } = require("../../../helper/emailTemplate")
const { razorpay, razorpaySignature } = require("../../../config/razorpay.config")
const { GetCartProductCouponApplay, GetCartProductShipingcharg, GetCartProductPaymentOrder, GetHeroBanners } = require("../../../helper/aggretionpipeline")
const { PercentageCoupenapplay, CartDiscountCoupenapplay, FindPriceinProduct, generateOrderNumber, ShippingDiscountCoupenapplay, sendNotification } = require("../../../helper/helper")
const userModel = require("../../../model/user.model")



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
            const discount = await PercentageCoupenapplay(coupon, carts, req.user)
            if (discount.success === false) {
                return next(CustomeError(409, discount.message))
            }
            return res.json(discount)
        }

        if (coupon.discountType === "CartDiscount") {
            const discount = await CartDiscountCoupenapplay(coupon, carts, req.user)
            if (discount.success === false) {
                return next(CustomeError(409, discount.message))
            }
            return res.json(discount)
        }

        if (coupon.discountType === "Shipping") {
            const shipping = await ShippingDiscountCoupenapplay(coupon, carts, req.user)
            if (shipping.success === false) {
                return next(CustomeError(409, shipping.message))
            }
            return res.json(shipping)
        }

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


        let cod = 0

        if (req.body?.cod) {
            cod = 1
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
            cod,
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

        const outOfStockProducts = [];

        for (const cartItem of products) {

            const requiredQuantity = Number(cartItem.quantity || 0);

            const availableStock = Number(cartItem.inventory?.stock || 0);

            if (availableStock < requiredQuantity) {
                outOfStockProducts.push({
                    productId: cartItem.productId,
                    productName: cartItem.product?.name,
                    size: cartItem.size,
                    color: cartItem.color,
                    requiredQuantity,
                    availableStock,
                    type: "product"
                });

                continue;
            }


            const selectedVariant = cartItem.variant?.variant?.find((variant) => {
                const variantName = variant.name?.toLowerCase().trim();
                const cartSize = cartItem.size?.toLowerCase().trim();
                const cartColor = cartItem.color?.toLowerCase().trim();
                return (
                    variantName === `${cartColor}/${cartSize}`
                );
            }
            );



            if (!selectedVariant) {
                outOfStockProducts.push({
                    productId: cartItem.productId,
                    productName: cartItem.product?.name,
                    size: cartItem.size,
                    color: cartItem.color,
                    requiredQuantity,
                    availableStock: 0,
                    type: "variant",
                    message: "Selected variant not found"
                });

                continue;
            }


            // Variant stock check
            const variantStock = Number(selectedVariant.stock || 0);

            if (variantStock < requiredQuantity) {
                outOfStockProducts.push({
                    productId: cartItem.productId,
                    productName: cartItem.product?.name,
                    size: cartItem.size,
                    color: cartItem.color,
                    requiredQuantity,
                    availableStock: variantStock,
                    type: "variant"
                });
            }
        }

        if (outOfStockProducts.length > 0) {
            return next(CustomeError(422, "Some products or variants do not have sufficient stock"));
        }
        let totalprice = FindPriceinProduct(products)
        if (shippingcharge) {
            totalprice += shippingcharge
        }
        if (discount) {
            totalprice -= discount
        }

        const options = {
            amount: Math.round(totalprice * 100),
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`
        };

        let order = await razorpay.orders.create(options)

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
        if (signature !== req.body?.razorpay_signature) {
            return res.status(409).json({ success: false, message: "payment not verify" })
        }





        const address = await addressModel.findById(req.body?.addressId)
        const carts = await cartModel.find({ _id: { $in: req.body?.cartIds }, userId: req.user._id });

        const orderItems = [];

        for (const cartItem of carts) {


            const productVariant = await productvariantModel.findOne({ productId: cartItem.productId });
            const productShipping = await productshippingModel.findOne({ productId: cartItem.productId })
            if (!productVariant) {
                return next(CustomeError(404, `Variant not found for product ${cartItem.productId}`))
            }
            const product = await productModel.findById(cartItem.productId)
            const variantName = `${cartItem.color}/${cartItem.size}`;
            const selectedVariant = productVariant.variant.find((variant) => variant.name === variantName);
            if (!selectedVariant) {
                return next(CustomeError(404, `Variant ${variantName} not found`))
            }




            orderItems.push({
                productId: cartItem.productId,
                variantId: selectedVariant._id,
                name: product.name,
                sku: selectedVariant.sku,
                size: cartItem.size,
                color: cartItem.color,
                image: product.productImage[0] || '',
                quantity: cartItem.quantity,
                price: selectedVariant.price,
                weight: productShipping.weight,
                dimensions: productShipping.dimensions,
                HSCode: productShipping.HSCode,
                total: selectedVariant.price * cartItem.quantity
            });

            const updatedVariant = await productvariantModel.findOneAndUpdate(
                {
                    variant: {
                        $elemMatch: {
                            _id: selectedVariant._id,
                            stock: { $gte: cartItem.quantity }
                        }
                    }
                },
                {
                    $inc: {
                        "variant.$.stock": -Number(cartItem.quantity)
                    }
                },
                {

                    returnDocument: "after"
                }
            );

            await productinventoryModel.findOneAndUpdate({ productId: cartItem.productId }, { $inc: { stock: -Number(cartItem.quantity) } }, { returnDocument: "after" });
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
            await cartModel.deleteMany({ _id: { $in: req.body?.cartIds }, userId: req.user._id });
        }
        const admin = await userModel.findOne({ role: "admin" })
        await sendEmail(OrderConfirmationMail(req.user.email, req.user.name, order.orderNumber, order.totalAmount, order.payment.method))
        await sendNotification(admin.deviceToken, "NEHDO", `new order recivied ${order.orderNumber}`)

        return res.status(200).json({ success: true, message: 'order create successfullly', order })
    } catch (error) {
        return next(error)
    }
}


exports.GetCategory = async (req, res, next) => {
    try {
        const DOMAIN = process.env.BACKEND_URL;

        const categories = await categoryModel.aggregate([
            {
                $match: {
                    status: "active",
                    homepageDisplay: true,
                },
            },
            {
                $sort: {
                    displayOrder: 1,
                },
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    desc: "$description",

                    image: {
                        $concat: [process.env.BACKEND_DOMIN_URL, "$logo"],
                    },

                    gradient: {
                        $let: {
                            vars: {
                                gradients: [
                                    "from-brand/70 to-brand-dark/80",
                                    "from-stone-700/70 to-stone-900/80",
                                    "from-sky-700/70 to-indigo-800/80",
                                    "from-rose-800/70 to-brand/80",
                                    "from-amber-800/70 to-brand-dark/80",
                                    //   "from-orange-700/70 to-orange-900/80",
                                ],
                            },
                            in: {
                                $arrayElemAt: [
                                    "$$gradients",
                                    {
                                        $floor: {
                                            $multiply: [
                                                { $rand: {} },
                                                { $size: "$$gradients" },
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
                    },
                },
            },
        ]);
        return res.status(200).json({ success: true, message: 'get categories', categories })
    } catch (error) {
        return next(error)
    }
}

exports.GetBrands = async (req, res, next) => {
    try {
        const brands = await brandModel.aggregate([
            {
                $match: {
                    status: "active",
                    homepageDisplay: true,
                },
            },
            {
                $project: {
                    _id: 0,

                    name: 1,

                    src: {
                        $concat: [
                            process.env.BACKEND_DOMIN_URL,
                            "$logo",
                        ],
                    },

                    width: {
                        $literal: 140,
                    },
                },
            },
        ]);
        return res.status(200).json({ success: true, message: "get brands", brands })
    } catch (error) {
        return next(error)
    }
}


exports.GetBanners = async (req, res, next) => {
    try {
        const category = req.query.category
        if (category === "Promotional Strip") {

            const now = new Date();

            // const baseUrl = `${req.protocol}://${req.get("host")}`;
            const baseUrl = process.env.BACKEND_DOMIN_URL;

            const banners = await bannerModel.aggregate([
                {
                    $match: {
                        isDeleted: false,
                        status: "Active",
                        placement: "Promotional Strip",

                        $or: [
                            {
                                startDate: null,
                                endDate: null,
                            },

                            {
                                startDate: {
                                    $ne: null,
                                    $lte: now,
                                },
                                endDate: null,
                            },

                            {
                                startDate: null,
                                endDate: {
                                    $ne: null,
                                    $gte: now,
                                },
                            },

                            {
                                startDate: {
                                    $ne: null,
                                    $lte: now,
                                },
                                endDate: {
                                    $ne: null,
                                    $gte: now,
                                },
                            },
                        ],
                    },
                },

                {
                    $sort: {
                        priority: 1,
                        createdAt: -1,
                    },
                },

                {
                    $project: {
                        _id: 1,
                        title: 1,
                        subtitle: 1,
                        ctaButtonText: 1,
                        priority: 1,

                        desktopImage: {
                            $cond: [
                                {
                                    $and: [
                                        {
                                            $ne: [
                                                "$desktopImage",
                                                null,
                                            ],
                                        },
                                        {
                                            $ne: [
                                                "$desktopImage",
                                                "",
                                            ],
                                        },
                                    ],
                                },
                                {
                                    $concat: [
                                        baseUrl,
                                        "$desktopImage",
                                    ],
                                },
                                null,
                            ],
                        },

                        mobileImage: {
                            $cond: [
                                {
                                    $and: [
                                        {
                                            $ne: [
                                                "$mobileImage",
                                                null,
                                            ],
                                        },
                                        {
                                            $ne: [
                                                "$mobileImage",
                                                "",
                                            ],
                                        },
                                    ],
                                },
                                {
                                    $concat: [
                                        baseUrl,
                                        "$mobileImage",
                                    ],
                                },
                                null,
                            ],
                        },
                    },
                },
            ]);
            return res.status(200).json({ success: true, message: 'get banners', banners })

        }

        if (category == "Hero Slider") {



            const banners = await bannerModel.aggregate(GetHeroBanners());
            return res.status(200).json({ success: true, message: 'get banners', banners })
        }
    } catch (error) {
        return next(error)
    }
}







exports.Getpromos = async (req, res, next) => {
    try {
        const now = new Date();

        const promos = await promoModel.aggregate([
            // =====================================================
            // PROMO FILTER
            // =====================================================
            {
                $match: {
                    status: {
                        $in: ["Active", "Scheduled"],
                    },

                    $or: [
                        {
                            startDate: null,
                            endDate: null,
                        },
                        {
                            startDate: {
                                $ne: null,
                                $lte: now,
                            },
                            endDate: null,
                        },
                        {
                            startDate: null,
                            endDate: {
                                $ne: null,
                                $gte: now,
                            },
                        },
                        {
                            startDate: {
                                $ne: null,
                                $lte: now,
                            },
                            endDate: {
                                $ne: null,
                                $gte: now,
                            },
                        },
                    ],
                },
            },
            {
                $project: {
                    _id: 0,
                    description: 1,
                },
            },
        ]);
        const descriptions = promos.map((promo) => promo.description);
        return res.status(200).json({ success: true, message: "get promos", promos: descriptions, });

    } catch (error) {

        return next(error)
    }
};







exports.placecodeorder = async (req, res, next) => {
    try {

        // await sendNotification(req.user.deviceToken,"nehdo" , `new order recivied ${Date.now()}`)

        //  return
        if (!req.body?.cartIds && !req.body?.cartIds?.length) {
            return next(CustomeError(422, 'cart id required'))
        }
        const address = await addressModel.findById(req.body?.addressId)
        const carts = await cartModel.find({ _id: { $in: req.body?.cartIds }, userId: req.user._id });

        const orderItems = [];

        for (const cartItem of carts) {


            const productVariant = await productvariantModel.findOne({ productId: cartItem.productId });
            const productShipping = await productshippingModel.findOne({ productId: cartItem.productId })

            if (!productVariant) {
                return next(CustomeError(404, `Variant not found for product ${cartItem.productId}`))
            }

            const product = await productModel.findById(cartItem.productId)
            const variantName = `${cartItem.color}/${cartItem.size}`;

            const selectedVariant = productVariant.variant.find((variant) => variant.name === variantName);

            if (!selectedVariant) {
                return next(CustomeError(404, `Variant ${variantName} not found`))
            }

            if (cartItem.quantity > selectedVariant.stock) {
                return next(CustomeError(422, "Some products or variants do not have sufficient stock"))
            }
            orderItems.push({
                productId: cartItem.productId,
                variantId: selectedVariant._id,
                name: product.name,
                sku: selectedVariant.sku,
                size: cartItem.size,
                color: cartItem.color,
                image: product.productImage[0] || '',
                quantity: cartItem.quantity,
                price: selectedVariant.price,
                weight: productShipping.weight,
                dimensions: productShipping.dimensions,
                HSCode: productShipping.HSCode,
                total: selectedVariant.price * cartItem.quantity
            });

            const updatedVariant = await productvariantModel.findOneAndUpdate(
                {
                    variant: { $elemMatch: { _id: selectedVariant._id, stock: { $gte: cartItem.quantity } } }
                },
                {
                    $inc: { "variant.$.stock": -Number(cartItem.quantity) }
                },
                {
                    returnDocument: "after"
                }
            );

            await productinventoryModel.findOneAndUpdate(
                { productId: cartItem.productId },
                {
                    $inc: {
                        stock: -Number(cartItem.quantity)
                    }
                },
                {
                    returnDocument: "after"
                }
            );
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
            method: "cod",
            status: "pending",
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
            await cartModel.deleteMany({ _id: { $in: req.body?.cartIds }, userId: req.user._id });
        }
const admin = await userModel.findOne({role:"admin"})

        await sendEmail(OrderConfirmationMail(req.user.email, req.user.name, order.orderNumber, order.totalAmount, order.payment.method))

        await sendNotification(admin?.deviceToken, "NEHDO", `new order recivied ${order.orderNumber}`)

        return res.status(200).json({ success: true, message: 'order create successfullly', order })
    } catch (error) {
        return next(error)
    }
}