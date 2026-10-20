const couponModel = require("../../../model/coupon.model");
const cartModel = require("../../../model/cart.model");
const addressModel = require("../../../model/address.model");
const productModel = require("../../../model/product.model");
const productvariantModel = require("../../../model/productvariant.model");
const productshippingModel = require("../../../model/productshipping.model");
const productinventoryModel = require("../../../model/productinventory.model");
const orderModel = require("../../../model/order.model");
const userModel = require("../../../model/user.model");
const sendEmail = require("../../../config/nodemailer.confing");
const { getshippingcharg } = require("../../../services/shiproketapis");
const { OrderConfirmationMail } = require("../../../helper/emailTemplate");
const { razorpay, razorpaySignature } = require("../../../config/razorpay.config");
const { generateOrderNumber, sendNotification, FindPriceinProduct } = require("../../../helper/helper");
const { GetCartProductPaymentOrder } = require("../../../helper/aggretionpipeline");
const { generateJwtToken, generatehashToken } = require("../../../middleware/jwtToken");
const mongoose = require("mongoose");
const crypto = require("crypto");

// Temporary in-memory cache for Magic Checkout addresses & shipping details
// Keyed by razorpay order_id
const magicOrderCache = new Map();

/**
 * 0. CREATE MAGIC ORDER
 * Called by frontend triggerMagicCheckout to initialize Razorpay order
 */
exports.createMagicOrder = async (req, res, next) => {
    try {
        let products = [];

        // 1. If valid DB cartIds provided
        if (req.body?.cartIds && Array.isArray(req.body.cartIds) && req.body.cartIds.length) {
            const validIds = req.body.cartIds.filter(id => mongoose.isValidObjectId(id));
            if (validIds.length) {
                products = await cartModel.aggregate(GetCartProductPaymentOrder(validIds));
            }
        }

        // 2. If guest items provided in req.body.items
        if ((!products || products.length === 0) && req.body?.items && Array.isArray(req.body.items) && req.body.items.length) {
            for (const item of req.body.items) {
                const prodId = item.productId || item._id;
                if (!prodId || !mongoose.isValidObjectId(prodId)) continue;
                const product = await productModel.findById(prodId);
                const variant = await productvariantModel.findOne({ productId: prodId });
                const inventory = await productinventoryModel.findOne({ productId: prodId });
                if (product) {
                    products.push({
                        _id: item._id || prodId,
                        productId: product._id,
                        size: item.size,
                        color: item.color,
                        quantity: Number(item.quantity || 1),
                        product,
                        variant,
                        inventory
                    });
                }
            }
        }

        if (!products.length) {
            return res.status(422).json({ success: false, message: "Cart items required" });
        }

        // Stock check
        for (const cartItem of products) {
            const requiredQuantity = Number(cartItem.quantity || 0);
            const availableStock = Number(cartItem.inventory?.stock || 0);
            if (availableStock < requiredQuantity) {
                return res.status(422).json({
                    success: false,
                    message: `Product ${cartItem.product?.name || ""} is out of stock`
                });
            }
        }

        const reqItems = Array.isArray(req.body?.items) ? req.body.items : [];

        // Build detailed line_items array required for Razorpay Magic Checkout (1CC) UI
        const line_items = products.map((item) => {
            const prod = item.product || {};
            const variant = item.variant || {};
            const selectedVariant = variant.variant?.find(v => v.name === `${item.color}/${item.size}`) || variant.variant?.[0] || {};
            
            // Match with client cart item if sent
            const clientMatch = reqItems.find(ci =>
                String(ci.productId) === String(item.productId?._id || item.productId || prod._id) &&
                String(ci.size || "").toLowerCase() === String(item.size || "").toLowerCase() &&
                String(ci.color || "").toLowerCase() === String(item.color || "").toLowerCase()
            ) || reqItems.find(ci => String(ci.productId) === String(item.productId?._id || item.productId || prod._id));

            // Price priority: client cart price (to guarantee 0 mismatch with Cart UI), then item.price, then variant price, then product salePrice/price
            let itemPrice = 0;
            if (clientMatch && Number(clientMatch.price) > 0) {
                itemPrice = Number(clientMatch.price);
            } else if (item.price && Number(item.price) > 0) {
                itemPrice = Number(item.price);
            } else if (selectedVariant && Number(selectedVariant.price) > 0) {
                itemPrice = Number(selectedVariant.price);
            } else {
                itemPrice = Number(prod.salePrice || prod.price || 0);
            }

            const priceInPaise = Math.round(Math.max(1, itemPrice) * 100);
            const qty = Number(item.quantity || clientMatch?.quantity || 1);

            let imageUrl = "";
            if (prod.productImage && prod.productImage.length > 0) {
                const img = prod.productImage[0];
                imageUrl = img.startsWith("http") ? img : `${process.env.BACKEND_DOMIN_URL || "https://nehdo.com"}${img}`;
            }

            return {
                sku: selectedVariant.sku || String(item.productId || item._id),
                variant_id: String(selectedVariant._id || item.productId || item._id),
                price: priceInPaise,
                offer_price: priceInPaise,
                quantity: qty,
                name: String(prod.name || clientMatch?.name || "Product"),
                image_url: imageUrl
            };
        });

        // Compute total amount strictly from line_items to ensure 100% match with Cart page
        const line_items_total = line_items.reduce((sum, li) => sum + (li.offer_price * li.quantity), 0);
        const discount = Number(req.body?.discount || 0);
        let finalAmountInPaise = line_items_total;
        if (discount > 0) {
            finalAmountInPaise = Math.max(100, finalAmountInPaise - Math.round(discount * 100));
        }

        const contact = req.body?.contact || req.body?.phone || req.user?.phone || "";
        const email = req.body?.email || req.user?.email || "";
        const name = req.body?.name || req.user?.name || "";

        const options = {
            amount: finalAmountInPaise,
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
            line_items_total,
            line_items,
            notes: {
                userId: req.user?._id ? String(req.user._id) : "",
                cartIds: Array.isArray(req.body?.cartIds) ? req.body.cartIds.join(",") : "",
                couponId: String(req.body?.couponId || req.body?.coupenId || ""),
                discount: String(discount || 0),
                contact: String(contact || ""),
                phone: String(contact || ""),
                email: String(email || ""),
                name: String(name || ""),
                magic_checkout: "true"
            }
        };

        const order = await razorpay.orders.create(options);

        // Cache products and contact for this order
        magicOrderCache.set(order.id, {
            amount: finalAmountInPaise,
            items: products,
            cartIds: req.body?.cartIds || [],
            discount,
            customer: {
                contact,
                email,
                name
            },
            createdAt: Date.now()
        });

        return res.status(200).json({
            success: true,
            message: "Magic order created",
            order,
            line_items,
            key: process.env.RAZORPAY_API_KEY
        });
    } catch (error) {
        console.error("createMagicOrder Error:", error);
        return next(error);
    }
};

/**
 * 1. URL FOR SHIPPING INFO
 * Razorpay Magic Checkout calls this endpoint to get delivery serviceability,
 * shipping methods, prepaid shipping fee, and COD fee.
 */
exports.getShippingInfo = async (req, res) => {
    try {
        const body = req.body || {};
        
        // Razorpay may send addresses as an array or single address object
        let incomingAddresses = [];
        if (Array.isArray(body.addresses) && body.addresses.length > 0) {
            incomingAddresses = body.addresses;
        } else if (body.address && typeof body.address === "object") {
            incomingAddresses = [body.address];
        }

        const customer = body.customer || {};
        const orderId = body.order_id || body.orderId || req.query?.order_id || req.query?.orderId || "";

        // Check cached order details to evaluate order total for free shipping threshold
        const cachedOrder = orderId ? magicOrderCache.get(orderId) : null;
        let orderAmount = 0;
        if (cachedOrder?.amount) {
            orderAmount = cachedOrder.amount / 100;
        } else if (cachedOrder?.items && Array.isArray(cachedOrder.items)) {
            orderAmount = cachedOrder.items.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 1)), 0);
        }

        const evaluatedAddresses = [];

        for (let i = 0; i < (incomingAddresses.length || 1); i++) {
            const addr = incomingAddresses[i] || {};
            const addrId = String(addr.id !== undefined ? addr.id : i);
            const pincode = String(
                addr.in_pin_code ||
                addr.pin_code ||
                addr.pincode ||
                addr.zipcode ||
                addr.postal_code ||
                body.pincode ||
                body.zipcode ||
                ""
            ).trim();

            const contact = addr.phone_number || addr.phone || addr.contact || customer.contact || body.contact || "";
            const email = customer.email || addr.email || body.email || "";
            const name = addr.name || `${addr.first_name || ""} ${addr.last_name || ""}`.trim() || customer.name || body.name || "";

            // Cache the incoming address and customer for this order_id
            if (orderId) {
                const existing = magicOrderCache.get(orderId) || {};
                magicOrderCache.set(orderId, {
                    ...existing,
                    customer: {
                        contact: contact || existing.customer?.contact || "",
                        email: email || existing.customer?.email || "",
                        name: name || existing.customer?.name || ""
                    },
                    address: {
                        addressline: addr.address || `${addr.flat || ""} ${addr.building || ""} ${addr.street || ""} ${addr.locality || ""}`.trim() || addr.addressline || addr.line1 || existing.address?.addressline || "",
                        landmark: addr.landmark || existing.address?.landmark || "",
                        city: addr.city || existing.address?.city || "",
                        state: addr.state || existing.address?.state || "",
                        postalCode: pincode || existing.address?.postalCode || "",
                        contact: contact || existing.address?.contact || "",
                        email: email || existing.address?.email || "",
                        name: name || existing.address?.name || ""
                    },
                    updatedAt: Date.now()
                });
            }

            // Free shipping on all orders above ₹250
            const isFreeShipping = orderAmount >= 250 || orderAmount === 0;
            const shippingFee = isFreeShipping ? 0 : 5000; // in paise
            const codFee = 0; // Free COD or standard

            const shippingMethods = [
                {
                    id: "express_delivery",
                    name: isFreeShipping ? "Free Express Delivery" : "Express Delivery",
                    description: isFreeShipping ? "Free shipping on orders above ₹250 (2-4 Days)" : "Delivered within 2-4 business days",
                    serviceable: true,
                    shipping_fee: shippingFee,
                    cod: true,
                    cod_fee: codFee,
                    cod_serviceable: true,
                    estimated_delivery_days: 3
                }
            ];

            evaluatedAddresses.push({
                id: addrId,
                zipcode: pincode || "395006",
                state_code: addr.state_code || addr.state || "IN",
                country: addr.country || "IN",
                serviceable: true,
                shipping_methods: shippingMethods
            });
        }

        const defaultMethods = evaluatedAddresses[0]?.shipping_methods || [
            {
                id: "express_delivery",
                name: "Free Express Delivery",
                description: "Delivered within 2-4 business days",
                serviceable: true,
                shipping_fee: 0,
                cod: true,
                cod_fee: 0,
                cod_serviceable: true,
                estimated_delivery_days: 3
            }
        ];

        return res.status(200).json({
            success: true,
            serviceable: true,
            addresses: evaluatedAddresses,
            shipping_methods: defaultMethods,
            shipping_fee: defaultMethods[0].shipping_fee,
            cod_serviceable: true,
            cod_fee: defaultMethods[0].cod_fee,
            estimated_delivery_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            error_message: ""
        });
    } catch (error) {
        console.error("Magic Checkout Shipping Info Error:", error);
        const fallbackMethods = [
            {
                id: "express_delivery",
                name: "Free Express Delivery",
                description: "Delivered within 2-4 business days",
                serviceable: true,
                shipping_fee: 0,
                cod: true,
                cod_fee: 0,
                cod_serviceable: true,
                estimated_delivery_days: 3
            }
        ];
        return res.status(200).json({
            success: true,
            serviceable: true,
            addresses: [
                {
                    id: "0",
                    serviceable: true,
                    shipping_methods: fallbackMethods
                }
            ],
            shipping_methods: fallbackMethods,
            shipping_fee: 0,
            cod_serviceable: true,
            cod_fee: 0,
            error_message: ""
        });
    }
};

/**
 * 2. URL FOR GET PROMOTIONS
 * Razorpay Magic Checkout calls this endpoint to list available coupons
 */
exports.getPromotions = async (req, res) => {
    try {
        const now = new Date();
        const coupons = await couponModel.find({
            status: "active",
            $and: [
                {
                    $or: [
                        { startDate: null },
                        { startDate: { $lte: now } }
                    ]
                },
                {
                    $or: [
                        { endDate: null },
                        { endDate: { $gte: now } }
                    ]
                }
            ]
        });

        const promotions = coupons.map((c) => {
            const isPercent = c.discountType === "Percentage";
            const desc = c.description || (isPercent ? `Get ${c.discountValue}% OFF` : `Get Flat ₹${c.discountValue} OFF`);
            
            return {
                reference_id: String(c._id),
                code: c.couponCode,
                description: desc,
                discount_type: isPercent ? "percentage" : "fixed_amount",
                discount_value: isPercent ? c.discountValue : Math.round(c.discountValue * 100), // in paise for fixed
                minimum_order_value: Math.round((c.minimumPurchase || 0) * 100), // in paise
                promotion: {
                    code: c.couponCode,
                    reference_id: String(c._id)
                }
            };
        });

        return res.status(200).json({ promotions });
    } catch (error) {
        console.error("Magic Checkout Get Promotions Error:", error);
        return res.status(200).json({ promotions: [] });
    }
};

/**
 * 3. URL FOR APPLY PROMOTIONS
 * Razorpay Magic Checkout calls this endpoint when a user applies a coupon code inside Magic Checkout
 */
exports.applyPromotion = async (req, res) => {
    try {
        const { code, order_id } = req.body || {};
        if (!code) {
            return res.status(200).json({
                success: false,
                error: {
                    code: "INVALID_PROMO_CODE",
                    description: "Coupon code is required"
                }
            });
        }

        const coupon = await couponModel.findOne({ couponCode: String(code).trim().toUpperCase() });
        if (!coupon) {
            return res.status(200).json({
                success: false,
                error: {
                    code: "INVALID_PROMO_CODE",
                    description: "Invalid coupon code"
                }
            });
        }

        const now = new Date();
        if (coupon.status !== "active") {
            return res.status(200).json({
                success: false,
                error: {
                    code: "INVALID_PROMO_CODE",
                    description: "This coupon is no longer active"
                }
            });
        }

        if (coupon.startDate && coupon.startDate > now) {
            return res.status(200).json({
                success: false,
                error: {
                    code: "INVALID_PROMO_CODE",
                    description: "This coupon has not started yet"
                }
            });
        }

        if (coupon.endDate && coupon.endDate < now) {
            return res.status(200).json({
                success: false,
                error: {
                    code: "INVALID_PROMO_CODE",
                    description: "This coupon has expired"
                }
            });
        }

        // Fetch Razorpay order amount if order_id is provided
        let orderAmount = 100000; // fallback ₹1000 in paise
        if (order_id) {
            try {
                const rzpOrder = await razorpay.orders.fetch(order_id);
                if (rzpOrder && rzpOrder.amount) {
                    orderAmount = rzpOrder.amount;
                }
            } catch (err) {
                console.warn("Could not fetch rzp order for promo validation:", err.message);
            }
        }

        // Validate minimum cart value
        const minOrderPaise = Math.round((coupon.minimumPurchase || 0) * 100);
        if (orderAmount < minOrderPaise) {
            return res.status(200).json({
                success: false,
                error: {
                    code: "MINIMUM_ORDER_NOT_MET",
                    description: `Minimum purchase of ₹${coupon.minimumPurchase} required for this coupon`
                }
            });
        }

        // Calculate discount in paise
        let discountPaise = 0;
        if (coupon.discountType === "Percentage") {
            discountPaise = Math.round((orderAmount * coupon.discountValue) / 100);
            if (coupon.maximumDiscount && coupon.maximumDiscount > 0) {
                const maxDiscountPaise = Math.round(coupon.maximumDiscount * 100);
                if (discountPaise > maxDiscountPaise) {
                    discountPaise = maxDiscountPaise;
                }
            }
        } else if (coupon.discountType === "CartDiscount" || coupon.discountType === "ProductDiscount") {
            discountPaise = Math.round(coupon.discountValue * 100);
        } else if (coupon.discountType === "Shipping") {
            discountPaise = 5000; // Free shipping discount in paise
        }

        // Cache applied coupon for this order
        if (order_id) {
            const cached = magicOrderCache.get(order_id) || {};
            magicOrderCache.set(order_id, {
                ...cached,
                appliedCoupon: coupon,
                discount: discountPaise / 100
            });
        }

        return res.status(200).json({
            success: true,
            code: coupon.couponCode,
            discount_amount: discountPaise, // in paise
            message: "Coupon applied successfully",
            promotion: {
                reference_id: String(coupon._id),
                code: coupon.couponCode
            }
        });
    } catch (error) {
        console.error("Magic Checkout Apply Promotion Error:", error);
        return res.status(200).json({
            success: false,
            error: {
                code: "PROMO_ERROR",
                description: "Failed to apply coupon. Please try again."
            }
        });
    }
};

/**
 * 4. COMPLETE MAGIC ORDER (Prepaid & COD)
 * Called from client frontend handler OR Webhook
 */
exports.completeMagicOrder = async (req, res, next) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            isCod,
            method,
            cartIds: clientCartIds,
            items: clientItems,
            addressId: clientAddressId,
            shippingAddress: clientShippingAddress,
            customer: clientCustomer,
            discount: clientDiscount,
            coupenId: clientCouponId,
            shipping: clientShipping
        } = req.body;

        if (!razorpay_order_id) {
            return res.status(422).json({ success: false, message: "razorpay_order_id is required" });
        }

        // Check if order was already recorded to maintain idempotency
        const existingOrder = await orderModel.findOne({
            $or: [
                { "payment.orderId": razorpay_order_id },
                { "payment.paymentId": razorpay_payment_id ? razorpay_payment_id : "__none__" }
            ]
        });

        if (existingOrder) {
            return res.status(200).json({
                success: true,
                message: "Order already confirmed",
                order: existingOrder
            });
        }

        // Determine if payment is COD or Online
        const isCashOnDelivery = Boolean(isCod || method === "cod" || !razorpay_signature);

        if (!isCashOnDelivery) {
            // Verify HMAC signature for online payment
            if (!razorpay_payment_id || !razorpay_signature) {
                return res.status(422).json({
                    success: false,
                    message: "razorpay_payment_id and razorpay_signature are required for prepaid orders"
                });
            }

            const expectedSignature = razorpaySignature(razorpay_order_id, razorpay_payment_id);
            if (expectedSignature !== razorpay_signature) {
                return res.status(409).json({ success: false, message: "Payment signature verification failed" });
            }
        }

        // Fetch Razorpay order details to recover notes/metadata if needed
        let rzpOrder = null;
        try {
            rzpOrder = await razorpay.orders.fetch(razorpay_order_id);
        } catch (fetchErr) {
            console.warn("Could not fetch razorpay order:", fetchErr.message);
        }

        // Fetch Razorpay payment details if available to extract contact and email
        let rzpPayment = null;
        if (razorpay_payment_id && !razorpay_payment_id.startsWith("cod_")) {
            try {
                rzpPayment = await razorpay.payments.fetch(razorpay_payment_id);
            } catch (payErr) {
                console.warn("Could not fetch razorpay payment:", payErr.message);
            }
        }

        // Fallback: If no direct payment or payment has no contact, fetch order payments from Razorpay
        if ((!rzpPayment || !rzpPayment.contact) && razorpay_order_id) {
            try {
                const payments = await razorpay.orders.fetchPayments(razorpay_order_id);
                if (payments?.items?.length) {
                    rzpPayment = payments.items.find(p => p.contact || p.email) || payments.items[0];
                }
            } catch (orderPayErr) {
                console.warn("Could not fetch order payments:", orderPayErr.message);
            }
        }

        const orderNotes = rzpOrder?.notes || {};
        const cachedData = magicOrderCache.get(razorpay_order_id) || {};

        // Resolve customer details from all potential sources
        const rawContact = clientCustomer?.contact || 
                           clientCustomer?.phone || 
                           req.body?.contact || 
                           req.body?.phone || 
                           rzpPayment?.contact || 
                           cachedData.customer?.contact || 
                           cachedData.address?.contact || 
                           orderNotes.contact || 
                           orderNotes.phone || 
                           req.user?.phone || 
                           "";

        const rawEmail = clientCustomer?.email || 
                         req.body?.email || 
                         rzpPayment?.email || 
                         cachedData.customer?.email || 
                         cachedData.address?.email || 
                         orderNotes.email || 
                         req.user?.email || 
                         "";

        const rawName = clientCustomer?.name || 
                        req.body?.name || 
                        cachedData.customer?.name || 
                        cachedData.address?.name || 
                        clientShippingAddress?.name || 
                        orderNotes.name || 
                        req.user?.name || 
                        "";

        // Normalize phone number (strip non-digits, extract last 10 digits)
        let cleanedPhone = String(rawContact || "").replace(/\D/g, "");
        if (cleanedPhone.length >= 10) {
            cleanedPhone = cleanedPhone.slice(-10);
        } else {
            cleanedPhone = null;
        }

        // Normalize email
        let cleanedEmail = String(rawEmail || "").trim().toLowerCase();
        if (!cleanedEmail || !cleanedEmail.includes("@")) {
            cleanedEmail = null;
        }

        let customerName = String(rawName || "").trim();
        if (!customerName) {
            customerName = cleanedPhone ? `Customer ${cleanedPhone}` : "Customer";
        }

        // Dynamic User Finding / Linking
        let user = req.user || null;
        let userId = user?._id || orderNotes.userId;

        if (!user && userId && mongoose.isValidObjectId(userId)) {
            user = await userModel.findById(userId);
        }

        if (!user && cleanedPhone) {
            const phoneVariants = [
                cleanedPhone,
                `+91${cleanedPhone}`,
                `91${cleanedPhone}`,
                `0${cleanedPhone}`
            ];

            // 1. If email is also available, first check if user exists matching both phone and email
            if (cleanedEmail) {
                user = await userModel.findOne({
                    $or: [
                        { phone: { $in: phoneVariants } },
                        { phone: new RegExp(`${cleanedPhone}$`) }
                    ],
                    email: cleanedEmail
                });
            }

            // 2. Find user by phone directly (matches exact 10 digits or regex ending with last 10 digits)
            if (!user) {
                user = await userModel.findOne({
                    $or: [
                        { phone: { $in: phoneVariants } },
                        { phone: new RegExp(`${cleanedPhone}$`) }
                    ]
                }).sort({ updatedAt: -1, createdAt: -1 });
            }

            // 3. Fallback: check if an existing address belongs to a user with this phone
            if (!user) {
                const addressDoc = await addressModel.findOne({
                    $or: [
                        { contact: { $in: phoneVariants } },
                        { contact: new RegExp(`${cleanedPhone}$`) },
                        { phone: { $in: phoneVariants } },
                        { phone: new RegExp(`${cleanedPhone}$`) }
                    ]
                }).sort({ createdAt: -1 });

                if (addressDoc?.userId && mongoose.isValidObjectId(addressDoc.userId)) {
                    user = await userModel.findById(addressDoc.userId);
                }
            }

            // 4. Fallback: check if a previous order was placed with this phone
            if (!user) {
                const prevOrder = await orderModel.findOne({
                    $or: [
                        { "shippingAddress.contact": { $in: phoneVariants } },
                        { "shippingAddress.contact": new RegExp(`${cleanedPhone}$`) },
                        { "shippingAddress.phone": { $in: phoneVariants } },
                        { "shippingAddress.phone": new RegExp(`${cleanedPhone}$`) }
                    ]
                }).sort({ createdAt: -1 });

                if (prevOrder?.userId && mongoose.isValidObjectId(prevOrder.userId)) {
                    user = await userModel.findById(prevOrder.userId);
                }
            }
        }

        // 5. If still no user found by phone, try finding by email
        if (!user && cleanedEmail) {
            user = await userModel.findOne({ email: cleanedEmail });
        }

        if (user) {
            // User exists: update missing phone or email so both get saved and normalized
            let needsSave = false;
            if (cleanedPhone && user.phone !== cleanedPhone) {
                user.phone = cleanedPhone;
                needsSave = true;
            }
            if (cleanedEmail && (!user.email || user.email.endsWith("@magic.nehdo.com") || user.email.includes("@magic."))) {
                const emailConflict = await userModel.findOne({ email: cleanedEmail, _id: { $ne: user._id } });
                if (!emailConflict) {
                    user.email = cleanedEmail;
                    needsSave = true;
                }
            }
            if (customerName && (!user.name || user.name.startsWith("Customer"))) {
                user.name = customerName;
                needsSave = true;
            }
            if (needsSave) {
                await user.save();
            }
        } else {
            // ONLY if user genuinely DOES NOT EXIST anywhere with this phone or email, create new user
            let finalEmail = cleanedEmail;
            if (!finalEmail) {
                finalEmail = `${cleanedPhone || Date.now()}@magic.nehdo.com`;
            }
            const emailConflict = await userModel.findOne({ email: finalEmail });
            if (emailConflict) {
                finalEmail = `${cleanedPhone || "user"}_${Date.now()}@magic.nehdo.com`;
            }

            user = await userModel.create({
                name: customerName,
                email: finalEmail,
                phone: cleanedPhone || null,
                role: "user",
                status: "active"
            });
        }

        userId = user._id;

        // Generate JWT Token for immediate seamless login
        let accessToken = null;
        try {
            accessToken = generateJwtToken({ id: user._id, role: user.role });
            const hashedToken = generatehashToken(accessToken);
            if (!user.accessToken) user.accessToken = [];
            user.accessToken.push(hashedToken);
            await user.save();
        } catch (tokenErr) {
            console.warn("Could not generate auto-login token:", tokenErr.message);
        }

        // Identify Cart Items: DB Cart or Guest Items from client
        let cartIds = clientCartIds;
        if ((!cartIds || !cartIds.length) && orderNotes.cartIds) {
            cartIds = orderNotes.cartIds.split(",").filter(Boolean);
        }

        const validDbCartIds = (cartIds || []).filter(id => id && mongoose.isValidObjectId(id));
        const dbCarts = validDbCartIds.length > 0 ? await cartModel.find({
            userId,
            _id: { $in: validDbCartIds }
        }) : [];

        let rawItemsList = [];
        if (dbCarts && dbCarts.length > 0) {
            rawItemsList = dbCarts.map(c => ({
                productId: c.productId,
                size: c.size,
                color: c.color,
                quantity: c.quantity,
                cartId: c._id
            }));
        } else if (clientItems && Array.isArray(clientItems) && clientItems.length > 0) {
            rawItemsList = clientItems.map(item => ({
                productId: item.productId || item._id,
                size: item.size,
                color: item.color,
                quantity: Number(item.quantity || 1)
            }));
        } else if (cachedData?.items && Array.isArray(cachedData.items) && cachedData.items.length > 0) {
            rawItemsList = cachedData.items.map(item => ({
                productId: item.productId || item._id,
                size: item.size,
                color: item.color,
                quantity: Number(item.quantity || 1)
            }));
        }

        if (!rawItemsList.length) {
            return res.status(404).json({ success: false, message: "No cart items found to create order" });
        }

        // Build Order Items and Deduct Inventory
        const orderItems = [];
        for (const cartItem of rawItemsList) {
            const productVariant = await productvariantModel.findOne({ productId: cartItem.productId });
            const productShipping = await productshippingModel.findOne({ productId: cartItem.productId });
            const product = await productModel.findById(cartItem.productId);

            if (!productVariant || !product) {
                continue;
            }

            const variantName = `${cartItem.color || ""}/${cartItem.size || ""}`.trim();
            const selectedVariant = productVariant.variant?.find(
                (v) => v.name?.toLowerCase().trim() === variantName.toLowerCase()
            ) || productVariant.variant?.[0];

            const itemPrice = selectedVariant ? selectedVariant.price : (product.salePrice || product.price);

            orderItems.push({
                productId: cartItem.productId,
                variantId: selectedVariant?._id || null,
                name: product.name,
                sku: selectedVariant?.sku || `SKU-${cartItem.productId}`,
                size: cartItem.size,
                color: cartItem.color,
                image: product.productImage?.[0] || "",
                quantity: Number(cartItem.quantity || 1),
                price: itemPrice,
                weight: productShipping?.weight || 0.5,
                dimensions: productShipping?.dimensions || { length: 0.5, width: 0.5, height: 0.5 },
                HSCode: productShipping?.HSCode || "",
                total: itemPrice * Number(cartItem.quantity || 1)
            });

            // Decrement Stock
            if (selectedVariant?._id) {
                await productvariantModel.findOneAndUpdate(
                    { variant: { $elemMatch: { _id: selectedVariant._id } } },
                    { $inc: { "variant.$.stock": -Number(cartItem.quantity || 1) } }
                );
            }
            await productinventoryModel.findOneAndUpdate(
                { productId: cartItem.productId },
                { $inc: { stock: -Number(cartItem.quantity || 1) } }
            );
        }

        // Resolve Shipping Address
        let shippingAddress = null;

        if (clientShippingAddress && clientShippingAddress.postalCode) {
            shippingAddress = clientShippingAddress;
        } else if (cachedData.address && cachedData.address.postalCode) {
            shippingAddress = cachedData.address;
        } else if (clientAddressId) {
            const dbAddress = await addressModel.findById(clientAddressId);
            if (dbAddress) {
                shippingAddress = {
                    addressline: `${dbAddress.addressline || ""} ${dbAddress.landmark || ""}`.trim(),
                    landmark: dbAddress.landmark || "",
                    city: dbAddress.city || "",
                    state: dbAddress.state || "",
                    postalCode: dbAddress.postalCode || ""
                };
            }
        }

        if (!shippingAddress) {
            const defaultAddr = await addressModel.findOne({ userId, defaultaddress: true });
            if (defaultAddr) {
                shippingAddress = {
                    addressline: `${defaultAddr.addressline || ""} ${defaultAddr.landmark || ""}`.trim(),
                    landmark: defaultAddr.landmark || "",
                    city: defaultAddr.city || "",
                    state: defaultAddr.state || "",
                    postalCode: defaultAddr.postalCode || ""
                };
            } else {
                shippingAddress = {
                    addressline: "Delivery Address",
                    landmark: "",
                    city: "Surat",
                    state: "Gujarat",
                    postalCode: "395005"
                };
            }
        }

        // Save address in DB for user (avoid duplicates)
        try {
            const postalCode = shippingAddress.postalCode || "000000";
            const addressline = shippingAddress.addressline || "Delivery Address";
            const existingAddress = await addressModel.findOne({
                userId,
                postalCode,
                addressline
            });
            if (!existingAddress) {
                await addressModel.create({
                    userId,
                    addressline,
                    landmark: shippingAddress.landmark || "",
                    city: shippingAddress.city || "City",
                    state: shippingAddress.state || "State",
                    postalCode,
                    defaultaddress: true
                });
            }
        } catch (addrErr) {
            console.warn("Could not save address to addressModel:", addrErr.message);
        }

        // Totals & Discounts
        const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
        const discount = Number(clientDiscount ?? (cachedData.discount ?? (orderNotes.discount || 0)));
        const couponId = clientCouponId || (cachedData.appliedCoupon?._id || orderNotes.couponId || null);

        let shippingCharge = Number(
            clientShipping ?? (isCashOnDelivery ? (cachedData.codFee || 40) : (cachedData.prepaidFee || 0))
        );
        if (orderNotes.shippingcharge) {
            shippingCharge = Number(orderNotes.shippingcharge);
        }

        const totalAmount = Math.max(0, subtotal + shippingCharge - discount);

        const orderNumber = await generateOrderNumber();
        const orderData = {
            userId,
            orderNumber,
            items: orderItems,
            shippingAddress,
            subtotal,
            shippingCharge,
            discount,
            couponId: couponId || null,
            totalAmount,
            payment: {
                method: isCashOnDelivery ? "cod" : "online",
                status: isCashOnDelivery ? "pending" : "paid",
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id || `cod_${Date.now()}`
            },
            status: "pending"
        };

        const createdOrder = await orderModel.create(orderData);

        // Clear Cart from DB if user had items in cartModel
        if (validDbCartIds.length > 0) {
            await cartModel.deleteMany({
                userId,
                _id: { $in: validDbCartIds }
            });
        }

        // Clean cache
        magicOrderCache.delete(razorpay_order_id);

        // Notifications & Confirmation Email
        try {
            const admin = await userModel.findOne({ role: "admin" });

            if (user?.email && !user.email.endsWith("@magic.nehdo.com")) {
                await sendEmail(
                    OrderConfirmationMail(
                        user.email,
                        user.name || "Customer",
                        createdOrder.orderNumber,
                        createdOrder.totalAmount,
                        createdOrder.payment.method
                    )
                );
            }
            if (admin?.deviceToken) {
                await sendNotification(admin.deviceToken, "NEHDO", `New Order received: ${createdOrder.orderNumber}`);
            }
        } catch (notifErr) {
            console.warn("Order notification warning:", notifErr.message);
        }

        return res.status(200).json({
            success: true,
            message: "Order placed successfully!",
            order: createdOrder,
            accessToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error("completeMagicOrder Error:", error);
        return next(error);
    }
};

/**
 * 5. RAZORPAY CENTRAL WEBHOOK
 * Listens for:
 * - order.placed (Magic Checkout COD order placed)
 * - payment.authorized / order.paid (Online payment completed)
 * - refund.*
 */
exports.razorpayWebhook = async (req, res) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const signature = req.headers["x-razorpay-signature"];

        // if (!signature || !webhookSecret) {
        //     return res.status(400).json({ success: false, message: "Webhook signature or secret missing" });
        // }

        const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body));
        const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");

        // if (expectedSignature !== signature) {
        //     console.error("Razorpay webhook signature mismatch");
        //     return res.status(401).json({ success: false, message: "Invalid webhook signature" });
        // }

        const body = req.body;
        const event = body.event;
        console.log("Razorpay Webhook Received Event:", event);

        // Handle Magic Checkout COD: 'order.placed' or 'payment.pending'
        if (event === "order.placed" || event === "payment.pending") {
            const orderEntity = body.payload?.order?.entity;
            const paymentEntity = body.payload?.payment?.entity;

            if (orderEntity?.id && paymentEntity?.method === "cod") {
                const existing = await orderModel.findOne({ "payment.orderId": orderEntity.id });
                if (!existing) {
                    console.log(`Processing Webhook COD Order for ${orderEntity.id}`);
                    // Trigger complete order with customer metadata
                    req.body = {
                        razorpay_order_id: orderEntity.id,
                        razorpay_payment_id: paymentEntity.id || `cod_${Date.now()}`,
                        isCod: true,
                        method: "cod",
                        contact: paymentEntity?.contact || orderEntity?.notes?.contact || "",
                        email: paymentEntity?.email || orderEntity?.notes?.email || "",
                        name: paymentEntity?.notes?.name || orderEntity?.notes?.name || "",
                        customer: {
                            contact: paymentEntity?.contact || orderEntity?.notes?.contact || "",
                            email: paymentEntity?.email || orderEntity?.notes?.email || "",
                            name: paymentEntity?.notes?.name || orderEntity?.notes?.name || ""
                        }
                    };
                    return exports.completeMagicOrder(req, res, () => res.status(200).json({ status: "ok" }));
                }
            }
        }

        // Handle Online Payment Completed: 'payment.authorized' or 'order.paid'
        if (event === "payment.authorized" || event === "order.paid") {
            const paymentEntity = body.payload?.payment?.entity;
            const orderId = paymentEntity?.order_id;
            if (orderId) {
                const existing = await orderModel.findOne({ "payment.orderId": orderId });
                if (!existing) {
                    console.log(`Processing Webhook Online Order for ${orderId}`);
                    req.body = {
                        razorpay_order_id: orderId,
                        razorpay_payment_id: paymentEntity.id,
                        isCod: false,
                        method: "online",
                        contact: paymentEntity?.contact || "",
                        email: paymentEntity?.email || "",
                        name: paymentEntity?.notes?.name || "",
                        customer: {
                            contact: paymentEntity?.contact || "",
                            email: paymentEntity?.email || "",
                            name: paymentEntity?.notes?.name || ""
                        }
                    };
                    return exports.completeMagicOrder(req, res, () => res.status(200).json({ status: "ok" }));
                }
            }
        }

        return res.status(200).json({ status: "ok" });
    } catch (err) {
        console.error("Razorpay Webhook Error:", err.message);
        return res.status(500).json({ status: "error", message: err.message });
    }
};

exports.verifyMagicOrder = exports.completeMagicOrder;

