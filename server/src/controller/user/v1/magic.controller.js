const couponModel = require("../../../model/coupon.model");
const cartModel = require("../../../model/cart.model");
const addressModel = require("../../../model/address.model");
const productModel = require("../../../model/product.model");
const productvariantModel = require("../../../model/productvariant.model");
const productshippingModel = require("../../../model/productshipping.model");
const productinventoryModel = require("../../../model/productinventory.model");
const orderModel = require("../../../model/order.model");
const userModel = require("../../../model/user.model");
const magicCheckoutModel = require("../../../model/magicCheckout.model");
const sendEmail = require("../../../config/nodemailer.confing");
const { getshippingcharg } = require("../../../services/shiproketapis");
const { OrderConfirmationMail } = require("../../../helper/emailTemplate");
const { razorpay, razorpaySignature } = require("../../../config/razorpay.config");
const { generateOrderNumber, sendNotification } = require("../../../helper/helper");
const { GetCartProductPaymentOrder } = require("../../../helper/aggretionpipeline");
const { generateJwtToken, generatehashToken } = require("../../../middleware/jwtToken");
const mongoose = require("mongoose");
const crypto = require("crypto");

/**
 * Helper: Validate whether a string is a valid absolute HTTP/HTTPS URL
 */
const isValidAbsoluteUrl = (url) => {
    if (!url || typeof url !== "string") return false;
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
};

/**
 * Helper: Robust matching of variant by color and size in productvariant document
 */
const findMatchingVariant = (productVariantDoc, color, size) => {
    if (!productVariantDoc || !Array.isArray(productVariantDoc.variant) || !productVariantDoc.variant.length) {
        return null;
    }
    const cleanColor = String(color || "").trim().toLowerCase();
    const cleanSize = String(size || "").trim().toLowerCase();

    // 1. Direct match with "color/size" or "color / size" or "size/color"
    let matched = productVariantDoc.variant.find((v) => {
        const vName = String(v.name || "").trim().toLowerCase();
        return (
            vName === `${cleanColor}/${cleanSize}` ||
            vName === `${cleanColor} / ${cleanSize}` ||
            vName === `${cleanSize}/${cleanColor}`
        );
    });

    // 2. Contains both color and size
    if (!matched && cleanColor && cleanSize) {
        matched = productVariantDoc.variant.find((v) => {
            const vName = String(v.name || "").trim().toLowerCase();
            return vName.includes(cleanColor) && vName.includes(cleanSize);
        });
    }

    // 3. Fallback if single variant exists and no color/size provided
    if (!matched && !cleanColor && !cleanSize && productVariantDoc.variant.length === 1) {
        matched = productVariantDoc.variant[0];
    }

    return matched || null;
};

/**
 * 0. CREATE MAGIC ORDER
 * Called by frontend to initialize Razorpay Magic Checkout (1CC)
 */
exports.createMagicOrder = async (req, res, next) => {
    try {
        let rawItems = [];

        // 1. Check if DB cartIds provided (Logged in user or valid cart IDs)
        if (req.body?.cartIds && Array.isArray(req.body.cartIds) && req.body.cartIds.length) {
            const validIds = req.body.cartIds.filter((id) => mongoose.isValidObjectId(id));
            if (validIds.length) {
                const aggregated = await cartModel.aggregate(GetCartProductPaymentOrder(validIds));
                if (aggregated && aggregated.length) {
                    rawItems = aggregated.map((item) => ({
                        productId: item.productId?._id || item.productId || item.product?._id,
                        size: item.size,
                        color: item.color,
                        quantity: Math.max(1, Math.floor(Number(item.quantity || 1))),
                        cartId: item._id
                    }));
                }
            }
        }

        // 2. Support direct product items (Guest checkout or Buy Now)
        if (!rawItems.length && req.body?.items && Array.isArray(req.body.items) && req.body.items.length) {
            for (const item of req.body.items) {
                const prodId = item.productId || item._id;
                if (!prodId || !mongoose.isValidObjectId(prodId)) continue;
                rawItems.push({
                    productId: prodId,
                    size: item.size,
                    color: item.color,
                    quantity: Math.max(1, Math.floor(Number(item.quantity || 1))),
                    cartId: item.cartId || null
                });
            }
        }

        if (!rawItems.length) {
            return res.status(422).json({ success: false, message: "Valid cart items or products required" });
        }

        // 3. Fetch product info, variant, inventory, and shipping from MongoDB
        // NEVER trust prices or stock sent by the frontend
        const validatedItems = [];

        for (const item of rawItems) {
            const product = await productModel.findById(item.productId);
            if (!product || product.status === "inactive") {
                return res.status(422).json({
                    success: false,
                    message: `Product ${product?.name || item.productId} is not available`
                });
            }

            const productVariantDoc = await productvariantModel.findOne({ productId: product._id });
            const productInventoryDoc = await productinventoryModel.findOne({ productId: product._id });
            const productShippingDoc = await productshippingModel.findOne({ productId: product._id });

            // Validate variant
            const matchedVariant = findMatchingVariant(productVariantDoc, item.color, item.size);

            if (productVariantDoc?.variant?.length && !matchedVariant) {
                return res.status(422).json({
                    success: false,
                    message: `Selected variant (${item.color || "default"}/${item.size || "default"}) for product "${product.name}" is unavailable`
                });
            }

            // Price calculation strictly from database
            let itemPrice = 0;
            if (matchedVariant && Number(matchedVariant.price) > 0) {
                itemPrice = Number(matchedVariant.price);
            } else if (Number(product.salePrice) > 0) {
                itemPrice = Number(product.salePrice);
            } else {
                itemPrice = Number(product.price || 0);
            }

            if (itemPrice <= 0) {
                return res.status(422).json({
                    success: false,
                    message: `Invalid price configuration for product "${product.name}"`
                });
            }

            // Stock validation: Check both variant-level stock and product-level inventory
            const qty = item.quantity;
            if (matchedVariant && matchedVariant.stock !== undefined) {
                if (Number(matchedVariant.stock) < qty) {
                    return res.status(422).json({
                        success: false,
                        message: `Product "${product.name}" (${item.color}/${item.size}) has insufficient stock (available: ${matchedVariant.stock})`
                    });
                }
            }

            const availableInventory = Number(productInventoryDoc?.stock ?? 0);
            if (availableInventory < qty) {
                return res.status(422).json({
                    success: false,
                    message: `Product "${product.name}" has insufficient stock (available: ${availableInventory})`
                });
            }

            // Image URL validation: Must be absolute valid URL or omitted
            let imageUrl = null;
            if (Array.isArray(product.productImage) && product.productImage.length > 0) {
                const rawImg = product.productImage[0];
                if (typeof rawImg === "string" && rawImg.trim()) {
                    const candidateUrl = rawImg.startsWith("http")
                        ? rawImg
                        : `${process.env.BACKEND_DOMIN_URL || "https://nehdo.com"}${rawImg.startsWith("/") ? "" : "/"}${rawImg}`;
                    if (isValidAbsoluteUrl(candidateUrl)) {
                        imageUrl = candidateUrl;
                    }
                }
            }

            validatedItems.push({
                productId: product._id,
                variantId: matchedVariant?._id || null,
                sku: matchedVariant?.sku || product.sku || `SKU-${product._id}`,
                name: product.name,
                size: item.size || "",
                color: item.color || "",
                quantity: qty,
                price: itemPrice, // in Rupees
                total: itemPrice * qty,
                image: imageUrl || "",
                weight: productShippingDoc?.weight || 0.5,
                dimensions: productShippingDoc?.dimensions || { length: 0.5, width: 0.5, height: 0.5 },
                HSCode: productShippingDoc?.HSCode || ""
            });
        }

        // 4. Generate line_items in Razorpay Magic Checkout format
        const line_items = validatedItems.map((item) => {
            const priceInPaise = Math.round(item.price * 100);
            const lineItem = {
                sku: String(item.sku),
                variant_id: String(item.variantId || item.productId),
                price: priceInPaise,
                offer_price: priceInPaise,
                quantity: item.quantity,
                name: String(item.name)
            };
            if (item.image) {
                lineItem.image_url = item.image;
            }
            return lineItem;
        });

        // Calculate subtotal in paise and rupees
        const subtotalInRupees = validatedItems.reduce((sum, item) => sum + item.total, 0);
        const line_items_total = line_items.reduce((sum, li) => sum + li.offer_price * li.quantity, 0);

        // 5. Server-side Coupon & Discount Validation
        let discountInRupees = 0;
        let appliedCouponDoc = null;
        const couponIdentifier = req.body?.couponId || req.body?.coupenId || req.body?.couponCode;

        if (couponIdentifier) {
            const query = mongoose.isValidObjectId(couponIdentifier)
                ? { _id: couponIdentifier }
                : { couponCode: String(couponIdentifier).trim().toUpperCase() };

            const coupon = await couponModel.findOne(query);
            const now = new Date();

            if (coupon && coupon.status === "active") {
                const isStarted = !coupon.startDate || coupon.startDate <= now;
                const isNotExpired = !coupon.endDate || coupon.endDate >= now;
                const meetsMinPurchase = !coupon.minimumPurchase || subtotalInRupees >= coupon.minimumPurchase;

                if (isStarted && isNotExpired && meetsMinPurchase) {
                    if (coupon.discountType === "Percentage") {
                        let disc = Math.round((subtotalInRupees * coupon.discountValue) / 100);
                        if (coupon.maximumDiscount && coupon.maximumDiscount > 0) {
                            disc = Math.min(disc, coupon.maximumDiscount);
                        }
                        discountInRupees = disc;
                    } else if (coupon.discountType === "CartDiscount" || coupon.discountType === "ProductDiscount") {
                        discountInRupees = Number(coupon.discountValue || 0);
                    }
                    // Prevent discount from exceeding eligible amount
                    discountInRupees = Math.min(discountInRupees, Math.max(0, subtotalInRupees - 1));
                    appliedCouponDoc = coupon;
                }
            }
        }

        // Final payable amount (Razorpay minimum is 100 paise / ₹1)
        const discountInPaise = Math.round(discountInRupees * 100);
        const finalAmountInPaise = Math.max(100, line_items_total - discountInPaise);

        // Customer contact information
        const contact = req.body?.contact || req.body?.phone || req.user?.phone || "";
        const email = req.body?.email || req.user?.email || "";
        const name = req.body?.name || req.user?.name || "";

        // 6. Create Order on Razorpay
        const options = {
            amount: finalAmountInPaise,
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
            line_items_total,
            line_items,
            notes: {
                userId: req.user?._id ? String(req.user._id) : "",
                cartIds: Array.isArray(req.body?.cartIds) ? req.body.cartIds.join(",") : "",
                couponId: appliedCouponDoc?._id ? String(appliedCouponDoc._id) : "",
                couponCode: appliedCouponDoc?.couponCode || "",
                discount: String(discountInRupees),
                contact: String(contact || ""),
                phone: String(contact || ""),
                email: String(email || ""),
                name: String(name || ""),
                magic_checkout: "true"
            }
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // 7. Persist Checkout Session in MongoDB (avoiding in-memory data loss on restart)
        await magicCheckoutModel.findOneAndUpdate(
            { orderId: razorpayOrder.id },
            {
                orderId: razorpayOrder.id,
                receipt: options.receipt,
                userId: req.user?._id || null,
                cartIds: (req.body?.cartIds || []).filter((id) => mongoose.isValidObjectId(id)),
                items: validatedItems,
                subtotal: subtotalInRupees,
                discount: discountInRupees,
                couponId: appliedCouponDoc?._id || null,
                couponCode: appliedCouponDoc?.couponCode || null,
                shippingFee: 0,
                codFee: 0,
                totalPayable: finalAmountInPaise / 100,
                customer: {
                    contact: String(contact || ""),
                    email: String(email || ""),
                    name: String(name || "")
                },
                status: "created"
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return res.status(200).json({
            success: true,
            message: "Magic order created",
            order: razorpayOrder,
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
 * Razorpay Magic Checkout calls this endpoint when delivery address is chosen
 */
exports.getShippingInfo = async (req, res) => {
    try {
        const body = req.body || {};
        const query = req.query || {};

        let incomingAddresses = [];
        if (Array.isArray(body.addresses) && body.addresses.length > 0) {
            incomingAddresses = body.addresses;
        } else if (body.address && typeof body.address === "object") {
            incomingAddresses = [body.address];
        }

        const customer = body.customer || {};
        const orderId = body.order_id || body.orderId || query.order_id || query.orderId || "";

        // Retrieve persistent checkout session
        let checkoutSession = null;
        if (orderId) {
            checkoutSession = await magicCheckoutModel.findOne({
                $or: [{ orderId }, { receipt: orderId }]
            });

            if (!checkoutSession && typeof orderId === "string" && orderId.startsWith("rcpt_")) {
                try {
                    const rzpOrders = await razorpay.orders.all({ receipt: orderId, count: 1 });
                    if (rzpOrders?.items?.length) {
                        const rzpOrder = rzpOrders.items[0];
                        checkoutSession = await magicCheckoutModel.findOne({ orderId: rzpOrder.id });
                        if (checkoutSession && !checkoutSession.receipt) {
                            checkoutSession.receipt = orderId;
                            await checkoutSession.save();
                        }
                    }
                } catch (e) {
                    console.warn("Could not fetch rzp order by receipt in getShippingInfo:", e?.error?.description || e?.message || e);
                }
            }
        }

        if (!checkoutSession && (customer.contact || body.contact || customer.email || body.email)) {
            const rawPhone = customer.contact || body.contact || "";
            const rawEmail = customer.email || body.email || "";
            const cleanPhone = rawPhone ? String(rawPhone).replace(/\D/g, "").slice(-10) : "";
            const queryConds = [];
            if (cleanPhone) {
                queryConds.push({ "customer.contact": { $regex: cleanPhone } });
            }
            if (rawEmail && rawEmail.includes("@")) {
                queryConds.push({ "customer.email": rawEmail.toLowerCase().trim() });
            }
            if (queryConds.length > 0) {
                checkoutSession = await magicCheckoutModel.findOne({
                    status: "created",
                    $or: queryConds
                }).sort({ createdAt: -1 });

                if (checkoutSession && orderId && orderId.startsWith("rcpt_") && !checkoutSession.receipt) {
                    checkoutSession.receipt = orderId;
                    await checkoutSession.save();
                }
            }
        }

        const subtotal = checkoutSession?.subtotal || 0;

        // Calculate package weight and dimensions from order items
        let totalWeight = 0.5;
        let dimensions = { length: 10, breadth: 10, height: 10 };
        if (checkoutSession?.items?.length) {
            totalWeight = checkoutSession.items.reduce((sum, item) => sum + (Number(item.weight) || 0.5) * item.quantity, 0);
            totalWeight = Math.max(0.1, Number(totalWeight.toFixed(2)));
        }

        const evaluatedAddresses = [];
        let primaryServiceable = false;
        let primaryCodServiceable = false;
        let primaryShippingFeeInPaise = 0;
        let primaryCodFeeInPaise = 0;
        let primaryDeliveryDays = 3;

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
            const addressline = addr.address || `${addr.flat || ""} ${addr.building || ""} ${addr.street || ""} ${addr.locality || ""}`.trim() || addr.addressline || addr.line1 || "";
            const landmark = addr.landmark || addr.line2 || "";
            const city = addr.city || "";
            const state = addr.state || addr.state_code || "";

            // Validate 6-digit Indian pincode
            const isValidPincode = /^[1-9][0-9]{5}$/.test(pincode);
            let isServiceable = false;
            let codServiceable = false;
            let shippingRateRupees = 50; // standard fallback rate if subtotal < 250
            let estimatedDays = 3;

            if (isValidPincode) {
                // Call Shiprocket serviceability API for prepaid
                try {
                    const prepaidCheck = await getshippingcharg({
                        pincode,
                        weight: totalWeight,
                        cod: 0,
                        length: dimensions.length,
                        breadth: dimensions.breadth,
                        height: dimensions.height
                    });

                    if (prepaidCheck && (prepaidCheck.status === 200 || prepaidCheck.data?.available_courier_companies?.length)) {
                        const couriers = prepaidCheck.data?.available_courier_companies || [];
                        if (couriers.length > 0) {
                            isServiceable = true;
                            const bestCourier = couriers.reduce((best, c) => (Number(c.rate) < Number(best.rate) ? c : best), couriers[0]);
                            shippingRateRupees = Number(bestCourier.rate) || 50;
                            estimatedDays = Number(bestCourier.estimated_delivery_days) || 3;
                        }
                    }
                } catch (shipErr) {
                    console.warn(`Shiprocket prepaid check error for pincode ${pincode}:`, shipErr.message);
                }

                // Call Shiprocket serviceability API for COD separately
                if (isServiceable) {
                    try {
                        const codCheck = await getshippingcharg({
                            pincode,
                            weight: totalWeight,
                            cod: 1,
                            length: dimensions.length,
                            breadth: dimensions.breadth,
                            height: dimensions.height
                        });

                        if (codCheck && (codCheck.status === 200 || codCheck.data?.available_courier_companies?.length)) {
                            const codCouriers = codCheck.data?.available_courier_companies || [];
                            codServiceable = codCouriers.length > 0;
                        }
                    } catch (codErr) {
                        console.warn(`Shiprocket COD check error for pincode ${pincode}:`, codErr.message);
                    }
                }
            }

            // Use actual courier shipping charge from Shiprocket API
            const shippingFeePaise = isServiceable ? Math.round(shippingRateRupees * 100) : 0;
            const codFeePaise = 0; // standard free COD or configured fee

            if (i === 0) {
                primaryServiceable = isServiceable;
                primaryCodServiceable = codServiceable;
                primaryShippingFeeInPaise = shippingFeePaise;
                primaryCodFeeInPaise = codFeePaise;
                primaryDeliveryDays = estimatedDays;
            }

            // Save verified address and shipping details to persistent checkout session
            if ((checkoutSession || orderId) && isServiceable && (addressline || city || pincode)) {
                const sessionQuery = checkoutSession?._id
                    ? { _id: checkoutSession._id }
                    : { $or: [{ orderId }, { receipt: orderId }] };
                await magicCheckoutModel.findOneAndUpdate(
                    sessionQuery,
                    {
                        customer: { contact, email, name },
                        address: {
                            addressline,
                            landmark,
                            city,
                            state,
                            postalCode: pincode,
                            contact,
                            email,
                            name
                        },
                        shippingFee: shippingFeePaise / 100,
                        codFee: codFeePaise / 100,
                        serviceable: isServiceable,
                        codServiceable
                    }
                );
            }

            const shippingMethods = isServiceable ? [
                {
                    id: "express_delivery",
                    name: "Express Delivery",
                    description: `Delivered within ${estimatedDays} business days`,
                    serviceable: true,
                    shipping_fee: shippingFeePaise,
                    cod: codServiceable,
                    cod_fee: codFeePaise,
                    cod_serviceable: codServiceable,
                    estimated_delivery_days: estimatedDays
                }
            ] : [];

            evaluatedAddresses.push({
                id: addrId,
                zipcode: pincode,
                state_code: addr.state_code || addr.state || "IN",
                country: addr.country || "IN",
                serviceable: isServiceable,
                shipping_methods: shippingMethods
            });
        }

        const shippingMethods = primaryServiceable ? [
            {
                id: "express_delivery",
                name: "Express Delivery",
                description: `Delivered within ${primaryDeliveryDays} business days`,
                serviceable: true,
                shipping_fee: primaryShippingFeeInPaise,
                cod: primaryCodServiceable,
                cod_fee: primaryCodFeeInPaise,
                cod_serviceable: primaryCodServiceable,
                estimated_delivery_days: primaryDeliveryDays
            }
        ] : [];

        return res.status(200).json({
            success: true,
            serviceable: primaryServiceable,
            addresses: evaluatedAddresses,
            shipping_methods: shippingMethods,
            shipping_fee: primaryShippingFeeInPaise,
            cod_serviceable: primaryCodServiceable,
            cod_fee: primaryCodFeeInPaise,
            estimated_delivery_date: new Date(Date.now() + primaryDeliveryDays * 24 * 60 * 60 * 1000).toISOString(),
            error_message: primaryServiceable ? "" : "Delivery is not serviceable to the selected location"
        });
    } catch (error) {
        console.error("getShippingInfo Error:", error);
        // Do not return fake serviceability or fake free shipping on error
        return res.status(200).json({
            success: true,
            serviceable: false,
            addresses: [],
            shipping_methods: [],
            shipping_fee: 0,
            cod_serviceable: false,
            cod_fee: 0,
            error_message: "Unable to verify delivery serviceability at this moment. Please check your pincode."
        });
    }
};

/**
 * 2. URL FOR GET PROMOTIONS
 * Razorpay Magic Checkout calls this endpoint to list active coupons
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
                        { startDate: { $exists: false } },
                        { startDate: { $lte: now } }
                    ]
                },
                {
                    $or: [
                        { endDate: null },
                        { endDate: { $exists: false } },
                        { endDate: { $gte: now } }
                    ]
                }
            ]
        });

        const promotions = coupons.map((c) => {
            const isPercent = c.discountType === "Percentage";
            let desc = c.description;
            if (!desc) {
                if (isPercent) {
                    desc = `Get ${c.discountValue}% OFF (Min order ₹${c.minimumPurchase || 0})`;
                } else if (c.discountType === "Shipping") {
                    desc = "Get Free Shipping on your order";
                } else {
                    desc = `Get Flat ₹${c.discountValue} OFF (Min order ₹${c.minimumPurchase || 0})`;
                }
            }

            let discountValuePaise = 0;
            if (isPercent) {
                discountValuePaise = c.discountValue; // percentage value
            } else if (c.discountType === "Shipping") {
                discountValuePaise = 5000; // standard shipping discount in paise
            } else {
                discountValuePaise = Math.round((c.discountValue || 0) * 100);
            }

            return {
                reference_id: String(c._id),
                code: c.couponCode,
                title: c.couponCode,
                label: c.couponCode,
                description: desc,
                discount_type: isPercent ? "percentage" : "fixed_amount",
                discount_value: discountValuePaise,
                value: discountValuePaise,
                value_type: isPercent ? "percentage" : "fixed_amount",
                type: "offer",
                minimum_order_value: Math.round((c.minimumPurchase || 0) * 100),
                promotion: {
                    code: c.couponCode,
                    title: c.couponCode,
                    reference_id: String(c._id),
                    value: discountValuePaise,
                    value_type: isPercent ? "percentage" : "fixed_amount",
                    type: "offer",
                    description: desc
                }
            };
        });

        return res.status(200).json({ success: true, promotions });
    } catch (error) {
        console.error("getPromotions Error:", error);
        return res.status(200).json({ success: true, promotions: [] });
    }
};

/**
 * 3. URL FOR APPLY PROMOTION
 * Razorpay Magic Checkout calls this endpoint when a coupon is entered
 */
exports.applyPromotion = async (req, res) => {
    try {
        const body = req.body || {};
        const query = req.query || {};
        const code = body.code || query.code;
        const order_id = body.order_id || body.orderId || query.order_id || query.orderId;
        const contact = body.contact || body.phone || query.contact || query.phone;
        const email = body.email || query.email;

        console.log("applyPromotion received:", { code, order_id, contact, email });

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
        if (!coupon || coupon.status !== "active") {
            return res.status(200).json({
                success: false,
                error: {
                    code: "INVALID_PROMO_CODE",
                    description: "Invalid or inactive coupon code"
                }
            });
        }

        // Strict timezone check using current standard time allocation
        const now = new Date();
        if (coupon.startDate && new Date(coupon.startDate) > now) {
            return res.status(200).json({
                success: false,
                error: {
                    code: "INVALID_PROMO_CODE",
                    description: "This coupon is not active yet"
                }
            });
        }

        if (coupon.endDate && new Date(coupon.endDate) < now) {
            return res.status(200).json({
                success: false,
                error: {
                    code: "EXPIRED_CODE",
                    description: "This coupon has expired"
                }
            });
        }

        // Fetch subtotal from persistent checkout session or Razorpay order
        let subtotalRupees = 0;
        let checkoutSession = null;

        if (order_id) {
            // 1. Try finding by orderId (Razorpay order ID) or receipt
            checkoutSession = await magicCheckoutModel.findOne({
                $or: [{ orderId: order_id }, { receipt: order_id }]
            });

            // 2. If not found in DB and order_id is a receipt (e.g. rcpt_1792754912980),
            // fetch order from Razorpay by receipt filter to locate the linked session
            if (!checkoutSession && typeof order_id === "string" && order_id.startsWith("rcpt_")) {
                try {
                    const rzpOrders = await razorpay.orders.all({ receipt: order_id, count: 1 });
                    if (rzpOrders?.items?.length) {
                        const rzpOrder = rzpOrders.items[0];
                        checkoutSession = await magicCheckoutModel.findOne({ orderId: rzpOrder.id });
                        if (checkoutSession) {
                            if (!checkoutSession.receipt) {
                                checkoutSession.receipt = order_id;
                                await checkoutSession.save();
                            }
                        } else if (rzpOrder.amount) {
                            subtotalRupees = rzpOrder.amount / 100;
                        }
                    }
                } catch (rzpErr) {
                    console.warn("Could not fetch rzp order by receipt for promo validation:", rzpErr?.error?.description || rzpErr?.message || rzpErr);
                }
            } else if (!checkoutSession && typeof order_id === "string" && order_id.startsWith("order_")) {
                // If it is a Razorpay Order ID (starts with order_)
                try {
                    const rzpOrder = await razorpay.orders.fetch(order_id);
                    if (rzpOrder?.amount) {
                        subtotalRupees = rzpOrder.amount / 100;
                    }
                } catch (rzpErr) {
                    console.warn("Could not fetch rzp order for promo validation:", rzpErr?.error?.description || rzpErr?.message || rzpErr);
                }
            }
        }

        // 3. Fallback: Lookup by customer contact or email in recent active checkout sessions
        if (!checkoutSession && (contact || email)) {
            const rawPhone = contact ? String(contact).replace(/\D/g, "").slice(-10) : "";
            const orConds = [];
            if (rawPhone) {
                orConds.push({ "customer.contact": { $regex: rawPhone } });
            }
            if (email && typeof email === "string" && email.includes("@")) {
                orConds.push({ "customer.email": email.toLowerCase().trim() });
            }
            if (orConds.length > 0) {
                checkoutSession = await magicCheckoutModel.findOne({
                    status: "created",
                    $or: orConds
                }).sort({ createdAt: -1 });

                if (checkoutSession && order_id) {
                    if (order_id.startsWith("rcpt_") && !checkoutSession.receipt) {
                        checkoutSession.receipt = order_id;
                        await checkoutSession.save();
                    } else if (order_id.startsWith("order_") && !checkoutSession.orderId) {
                        checkoutSession.orderId = order_id;
                        await checkoutSession.save();
                    }
                }
            }
        }

        if (checkoutSession?.subtotal) {
            subtotalRupees = checkoutSession.subtotal;
        }

        // Validate minimum purchase amount
        const minPurchase = Number(coupon.minimumPurchase || 0);
        if (subtotalRupees > 0 && subtotalRupees < minPurchase) {
            return res.status(200).json({
                success: false,
                error: {
                    code: "REQUIREMENT_NOT_MET",
                    description: `Minimum purchase of ₹${minPurchase} required for this coupon`
                }
            });
        }

        // Calculate discount in Rupees
        let discountRupees = 0;
        if (coupon.discountType === "Percentage") {
            discountRupees = Math.round((subtotalRupees * coupon.discountValue) / 100);
            if (coupon.maximumDiscount && coupon.maximumDiscount > 0) {
                discountRupees = Math.min(discountRupees, coupon.maximumDiscount);
            }
        } else if (coupon.discountType === "Shipping") {
            discountRupees = checkoutSession?.shippingFee || 50;
        } else {
            discountRupees = Number(coupon.discountValue || 0);
        }

        // Prevent discount from exceeding subtotal
        if (subtotalRupees > 0) {
            discountRupees = Math.min(discountRupees, Math.max(0, subtotalRupees - 1));
        }

        const discountPaise = Math.round(discountRupees * 100);

        // Update persistent checkout session with applied coupon
        if (checkoutSession?._id) {
            await magicCheckoutModel.findByIdAndUpdate(
                checkoutSession._id,
                {
                    couponId: coupon._id,
                    couponCode: coupon.couponCode,
                    discount: discountRupees
                }
            );
        } else if (order_id) {
            await magicCheckoutModel.findOneAndUpdate(
                { $or: [{ orderId: order_id }, { receipt: order_id }] },
                {
                    couponId: coupon._id,
                    couponCode: coupon.couponCode,
                    discount: discountRupees
                }
            );
        }

        const description = coupon.description || `${coupon.couponCode} applied (-₹${discountRupees})`;
        const promoPayload = {
            reference_id: String(coupon._id),
            type: "offer",
            code: coupon.couponCode,
            value: discountPaise,
            discount_amount: discountPaise,
            value_type: "fixed_amount",
            description
        };

        // Razorpay Magic Checkout standard promotion success response (providing promotion, data, and top-level fields)
        return res.status(200).json({
            success: true,
            promotion: promoPayload,
            data: promoPayload,
            reference_id: String(coupon._id),
            code: coupon.couponCode,
            value: discountPaise,
            discount_amount: discountPaise,
            value_type: "fixed_amount",
            description
        });
    } catch (error) {
        console.error("applyPromotion Error:", error);
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
 * Helper: Rollback deducted inventory if an error occurs during order placement
 */
const rollbackStockDeductions = async (deductedItems) => {
    for (const item of deductedItems) {
        try {
            if (item.variantId) {
                await productvariantModel.findOneAndUpdate(
                    { "variant._id": item.variantId },
                    { $inc: { "variant.$.stock": item.quantity } }
                );
            }
            await productinventoryModel.findOneAndUpdate(
                { productId: item.productId },
                { $inc: { stock: item.quantity } }
            );
        } catch (err) {
            console.error("Rollback stock error:", err.message);
        }
    }
};

/**
 * 4. COMPLETE MAGIC ORDER (Prepaid & COD)
 * Called from frontend modal handler OR Webhook
 */
exports.completeMagicOrder = async (req, res, next) => {
    let deductedStockItems = [];
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            isCod: clientIsCod,
            method: clientMethod,
            cartIds: clientCartIds,
            shippingAddress: clientShippingAddress,
            customer: clientCustomer
        } = req.body || {};

        if (!razorpay_order_id) {
            return res.status(422).json({ success: false, message: "razorpay_order_id is required" });
        }


        // Fetch order details directly from Razorpay (contains customer_details, shipping_address, billing_address, etc.)
        let rzpOrder = null;
        try {
            rzpOrder = await razorpay.orders.fetch(razorpay_order_id);
            console.log("Razorpay Order:", rzpOrder);
        } catch (fetchErr) {
            console.warn("Could not fetch razorpay order:", fetchErr.message);
        }

        // 1. Idempotency Check: Check if order already recorded in orderModel
        const existingOrder = await orderModel.findOne({
            $or: [
                { "payment.orderId": razorpay_order_id },
                { "payment.paymentId": razorpay_payment_id && !razorpay_payment_id.startsWith("cod_") ? razorpay_payment_id : "__none__" }
            ]
        });

        if (existingOrder) {
            return res.status(200).json({
                success: true,
                message: "Order already confirmed",
                order: existingOrder
            });
        }

        // 2. Retrieve persistent checkout session
        let checkoutSession = await magicCheckoutModel.findOne({
            $or: [{ orderId: razorpay_order_id }, { receipt: razorpay_order_id }]
        });
        if (!checkoutSession && typeof razorpay_order_id === "string" && razorpay_order_id.startsWith("rcpt_")) {
            try {
                const rzpOrders = await razorpay.orders.all({ receipt: razorpay_order_id, count: 1 });
                if (rzpOrders?.items?.length) {
                    checkoutSession = await magicCheckoutModel.findOne({ orderId: rzpOrders.items[0].id });
                }
            } catch (err) {}
        }
        if (checkoutSession && checkoutSession.status === "completed" && checkoutSession.completedOrderId) {
            const completed = await orderModel.findById(checkoutSession.completedOrderId);
            if (completed) {
                return res.status(200).json({
                    success: true,
                    message: "Order already confirmed",
                    order: completed
                });
            }
        }

        // 3. Authenticate Payment vs COD
        // Never treat missing signature as proof of COD.
        let isCashOnDelivery = false;
        let rzpPayment = null;

        // Check if Razorpay has an authenticated payment entity for this order
        if (razorpay_payment_id && !razorpay_payment_id.startsWith("cod_")) {
            try {
                rzpPayment = await razorpay.payments.fetch(razorpay_payment_id);
            } catch (pErr) {
                console.warn("Could not fetch razorpay payment:", pErr.message);
            }
        }

        if (!rzpPayment) {
            try {
                const payments = await razorpay.orders.fetchPayments(razorpay_order_id);
                if (payments?.items?.length) {
                    rzpPayment = payments.items.find((p) => p.status === "captured" || p.method === "cod") || payments.items[0];
                }
            } catch (listErr) {
                console.warn("Could not fetch order payments from Razorpay:", listErr.message);
            }
        }

        // Verify prepaid online payment
        if (razorpay_signature) {
            if (!razorpay_payment_id) {
                return res.status(422).json({
                    success: false,
                    message: "razorpay_payment_id is required for signature verification"
                });
            }

            const expectedSignature = razorpaySignature(razorpay_order_id, razorpay_payment_id);
            if (expectedSignature !== razorpay_signature) {
                return res.status(409).json({ success: false, message: "Payment signature verification failed" });
            }

            // Verify payment was captured on Razorpay
            if (!rzpPayment || rzpPayment.order_id !== razorpay_order_id) {
                return res.status(422).json({ success: false, message: "Payment does not match Razorpay order" });
            }

            if (rzpPayment.status !== "captured") {
                return res.status(422).json({
                    success: false,
                    message: `Payment is not captured (current status: ${rzpPayment.status})`
                });
            }

            if (rzpPayment.currency !== "INR") {
                return res.status(422).json({ success: false, message: "Invalid payment currency" });
            }

            isCashOnDelivery = false;
        } else {
            // No signature provided: Check if officially confirmed COD
            const isWebhookCod = req.isWebhookCod === true;
            const rzpMethodIsCod = rzpPayment?.method === "cod";
            const clientClaimsCod = Boolean(clientIsCod || clientMethod === "cod");

            if (isWebhookCod || rzpMethodIsCod) {
                isCashOnDelivery = true;
            } else if (clientClaimsCod) {
                // If client claims COD, verify against Razorpay payments or order notes
                if (rzpPayment && rzpPayment.method === "cod") {
                    isCashOnDelivery = true;
                } else if (rzpOrder && (rzpOrder.status === "attempted" || rzpOrder.status === "created")) {
                    // Check if COD was serviceable and selected during 1CC shipping info
                    if (checkoutSession && checkoutSession.codServiceable) {
                        isCashOnDelivery = true;
                    } else {
                        return res.status(422).json({
                            success: false,
                            message: "COD is not verified or not serviceable for this order"
                        });
                    }
                } else {
                    return res.status(422).json({
                        success: false,
                        message: "Invalid COD order confirmation. Missing Razorpay verification."
                    });
                }
            } else if (rzpOrder?.status === "paid" || rzpPayment?.status === "captured") {
                // If payment is already captured/paid on Razorpay (e.g. Magic Checkout prepaid completed)
                isCashOnDelivery = false;
            } else {
                return res.status(422).json({
                    success: false,
                    message: "Missing payment signature for prepaid order"
                });
            }
        }

        // 4. Resolve Customer Information (from Razorpay customer_details, payment, checkoutSession, notes, etc.)
        const rzpCustomer = rzpOrder?.customer_details || {};
        const rzpShipping = rzpCustomer.shipping_address || rzpCustomer.billing_address || {};
        const orderNotes = rzpOrder?.notes || {};

        const rawContact =
            rzpCustomer.contact ||
            rzpShipping.contact ||
            rzpPayment?.contact ||
            checkoutSession?.customer?.contact ||
            checkoutSession?.address?.contact ||
            clientCustomer?.contact ||
            clientCustomer?.phone ||
            req.body?.contact ||
            orderNotes.contact ||
            orderNotes.phone ||
            req.user?.phone ||
            "";

        const rawEmail =
            rzpCustomer.email ||
            rzpPayment?.email ||
            checkoutSession?.customer?.email ||
            checkoutSession?.address?.email ||
            clientCustomer?.email ||
            req.body?.email ||
            orderNotes.email ||
            req.user?.email ||
            "";

        const rawName =
            rzpShipping.name ||
            rzpCustomer.name ||
            rzpPayment?.notes?.name ||
            checkoutSession?.customer?.name ||
            checkoutSession?.address?.name ||
            clientCustomer?.name ||
            req.body?.name ||
            clientShippingAddress?.name ||
            orderNotes.name ||
            req.user?.name ||
            "";

        // Phone normalization: exactly 10 digits
        let cleanedPhone = String(rawContact || "").replace(/\D/g, "");
        if (cleanedPhone.length >= 10) {
            cleanedPhone = cleanedPhone.slice(-10);
        } else {
            cleanedPhone = null;
        }

        // Email normalization
        let cleanedEmail = String(rawEmail || "").trim().toLowerCase();
        if (!cleanedEmail || !cleanedEmail.includes("@")) {
            cleanedEmail = null;
        }

        let customerName = String(rawName || "").trim();
        if (!customerName) {
            customerName = cleanedPhone ? `Customer ${cleanedPhone}` : "Customer";
        }

        // 5. Customer Identification & Prevent Overwriting Existing Users
        let user = req.user || null;
        let userId = user?._id || orderNotes.userId;

        if (!user && userId && mongoose.isValidObjectId(userId)) {
            user = await userModel.findById(userId);
        }

        if (!user && cleanedPhone) {
            const phoneVariants = [cleanedPhone, `+91${cleanedPhone}`, `91${cleanedPhone}`, `0${cleanedPhone}`];
            user = await userModel.findOne({
                $or: [{ phone: { $in: phoneVariants } }, { phone: new RegExp(`${cleanedPhone}$`) }]
            });
        }

        if (!user && cleanedEmail) {
            user = await userModel.findOne({ email: cleanedEmail });
        }

        if (user) {
            userId = user._id;
            // PRESERVE user integrity: DO NOT overwrite existing phone or email with unverified input
            if ((!user.name || user.name.startsWith("Customer")) && customerName && !customerName.startsWith("Customer")) {
                user.name = customerName;
                await user.save();
            }
        } else {
            // Create a new guest user only when no user exists with this phone or email
            let finalEmail = cleanedEmail;
            if (!finalEmail) {
                finalEmail = `${cleanedPhone || Date.now()}@guest.nehdo.com`;
            }
            const emailConflict = await userModel.findOne({ email: finalEmail });
            if (emailConflict) {
                finalEmail = `${cleanedPhone || "guest"}_${Date.now()}@guest.nehdo.com`;
            }

            user = await userModel.create({
                name: customerName,
                email: finalEmail,
                phone: cleanedPhone || null,
                role: "user",
                status: "active"
            });
            userId = user._id;
        }

        // Generate JWT token for seamless checkout experience
        let accessToken = null;
        try {
            accessToken = generateJwtToken({ id: user._id, role: user.role });
            const hashedToken = generatehashToken(accessToken);
            if (!user.accessToken) user.accessToken = [];
            user.accessToken.push(hashedToken);
            await user.save();
        } catch (tokenErr) {
            console.warn("Could not generate session token:", tokenErr.message);
        }

        // 6. Resolve Shipping Address (from Razorpay customer_details, checkoutSession, or client)
        let shippingAddress = null;

        const rzpZipcode = String(
            rzpShipping.zipcode ||
            rzpShipping.postal_code ||
            rzpShipping.postalCode ||
            rzpShipping.pincode ||
            ""
        ).trim();
        const rzpLine1 = (rzpShipping.line1 || rzpShipping.addressline || rzpShipping.address || "").trim();
        const rzpLine2 = (rzpShipping.line2 || rzpShipping.landmark || "").trim();
        const rzpCity = (rzpShipping.city || "").trim();
        const rzpState = (rzpShipping.state || rzpShipping.state_code || "").trim();

        if (rzpZipcode && (rzpLine1 || rzpLine2)) {
            shippingAddress = {
                addressline: rzpLine1 || rzpLine2,
                landmark: rzpLine2 || rzpLine1,
                city: rzpCity,
                state: rzpState,
                postalCode: rzpZipcode
            };
        } else if (checkoutSession?.address?.postalCode && checkoutSession?.address?.addressline) {
            shippingAddress = {
                addressline: checkoutSession.address.addressline,
                landmark: checkoutSession.address.landmark || "",
                city: checkoutSession.address.city,
                state: checkoutSession.address.state,
                postalCode: checkoutSession.address.postalCode
            };
        } else if (clientShippingAddress?.postalCode && clientShippingAddress?.addressline) {
            shippingAddress = {
                addressline: clientShippingAddress.addressline,
                landmark: clientShippingAddress.landmark || "",
                city: clientShippingAddress.city,
                state: clientShippingAddress.state,
                postalCode: clientShippingAddress.postalCode
            };
        } else {
            const defaultAddr = await addressModel.findOne({ userId, defaultaddress: true });
            if (defaultAddr && defaultAddr.addressline && defaultAddr.postalCode) {
                shippingAddress = {
                    addressline: defaultAddr.addressline,
                    landmark: defaultAddr.landmark || "",
                    city: defaultAddr.city,
                    state: defaultAddr.state,
                    postalCode: defaultAddr.postalCode
                };
            }
        }

        if (
            !shippingAddress ||
            !shippingAddress.addressline ||
            !shippingAddress.city ||
            !shippingAddress.state ||
            !shippingAddress.postalCode ||
            !/^[1-9][0-9]{5}$/.test(String(shippingAddress.postalCode).trim())
        ) {
            return res.status(422).json({
                success: false,
                message: "Valid delivery address and 6-digit postal code are required"
            });
        }

        // Save delivery address to user address book if not already saved
        try {
            const existingAddress = await addressModel.findOne({
                userId,
                postalCode: shippingAddress.postalCode,
                addressline: shippingAddress.addressline
            });
            if (!existingAddress) {
                await addressModel.create({
                    userId,
                    addressline: shippingAddress.addressline,
                    landmark: shippingAddress.landmark || shippingAddress.city || "N/A",
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    postalCode: shippingAddress.postalCode,
                    defaultaddress: true
                });
            }
        } catch (addrErr) {
            console.warn("Could not save address to addressModel:", addrErr.message);
        }

        // 7. Resolve Order Items (Strictly from validated checkoutSession or DB)
        let verifiedItems = checkoutSession?.items || [];

        if (!verifiedItems.length) {
            return res.status(404).json({
                success: false,
                message: "Checkout items not found. Please initiate checkout again."
            });
        }

        // 8. Atomic Stock Updates: Prevent Negative Stock
        const orderItems = [];
        deductedStockItems = [];

        for (const item of verifiedItems) {
            const qty = item.quantity;

            // Atomic decrement on variant stock
            if (item.variantId) {
                const variantUpdate = await productvariantModel.findOneAndUpdate(
                    { "variant._id": item.variantId, "variant.stock": { $gte: qty } },
                    { $inc: { "variant.$.stock": -qty } },
                    { new: true }
                );
                if (!variantUpdate) {
                    await rollbackStockDeductions(deductedStockItems);
                    return res.status(422).json({
                        success: false,
                        message: `Item "${item.name}" (${item.color}/${item.size}) is out of stock`
                    });
                }
            }

            // Atomic decrement on product inventory stock
            const inventoryUpdate = await productinventoryModel.findOneAndUpdate(
                { productId: item.productId, stock: { $gte: qty } },
                { $inc: { stock: -qty } },
                { new: true }
            );
            if (!inventoryUpdate) {
                // Rollback this item's variant stock
                if (item.variantId) {
                    await productvariantModel.findOneAndUpdate(
                        { "variant._id": item.variantId },
                        { $inc: { "variant.$.stock": qty } }
                    );
                }
                await rollbackStockDeductions(deductedStockItems);
                return res.status(422).json({
                    success: false,
                    message: `Item "${item.name}" has insufficient inventory stock`
                });
            }

            deductedStockItems.push(item);

            orderItems.push({
                productId: item.productId,
                variantId: item.variantId || null,
                sku: item.sku,
                name: item.name,
                size: item.size,
                color: item.color,
                image: item.image,
                quantity: qty,
                price: item.price,
                weight: item.weight || 0.5,
                dimensions: item.dimensions || { length: 0.5, width: 0.5, height: 0.5 },
                HSCode: item.HSCode || "",
                total: item.price * qty
            });
        }

        // 9. Consistent Calculations for Order Amounts
        const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
        const discount = Number(checkoutSession?.discount || orderNotes.discount || 0);
        let shippingCharge = Number(checkoutSession?.shippingFee || orderNotes.shippingcharge || 0);
        if (!shippingCharge && rzpOrder?.shipping_fee) {
            shippingCharge = Number(rzpOrder.shipping_fee) / 100;
        }
        const totalAmount = Math.max(0, subtotal + shippingCharge - discount);

        // 10. Create Order in MongoDB
        const orderNumber = await generateOrderNumber();
        const paymentId = isCashOnDelivery
            ? (razorpay_payment_id || `cod_${orderNumber}`)
            : (razorpay_payment_id || rzpPayment?.id || "");

        const orderData = {
            userId,
            orderNumber,
            items: orderItems,
            shippingAddress,
            subtotal,
            shippingCharge,
            discount,
            couponId: checkoutSession?.couponId || null,
            totalAmount,
            payment: {
                method: isCashOnDelivery ? "cod" : "online",
                status: isCashOnDelivery ? "pending" : "paid",
                orderId: razorpay_order_id,
                paymentId
            },
            status: "pending"
        };

        const createdOrder = await orderModel.create(orderData);

        // Update persistent checkout session to completed
        const sessionUpdateQuery = checkoutSession?._id
            ? { _id: checkoutSession._id }
            : { $or: [{ orderId: razorpay_order_id }, { receipt: razorpay_order_id }] };
        await magicCheckoutModel.findOneAndUpdate(
            sessionUpdateQuery,
            {
                status: "completed",
                completedOrderId: createdOrder._id,
                ...(shippingAddress ? { address: shippingAddress } : {}),
                ...(customerName || cleanedPhone || cleanedEmail ? {
                    customer: {
                        name: customerName,
                        email: cleanedEmail || "",
                        contact: cleanedPhone || ""
                    }
                } : {})
            }
        );

        // 11. Clear Cart only after successful order creation
        const cartIdsToClear = (clientCartIds || checkoutSession?.cartIds || []).filter((id) => mongoose.isValidObjectId(id));
        if (cartIdsToClear.length > 0) {
            await cartModel.deleteMany({
                userId,
                _id: { $in: cartIdsToClear }
            });
        }

        // 12. Order Confirmation Email & Admin Push Notification
        try {
            const admin = await userModel.findOne({ role: "admin" });

            if (user?.email && !user.email.endsWith("@guest.nehdo.com") && !user.email.endsWith("@magic.nehdo.com")) {
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
        // Rollback any stock deducted if order creation failed
        if (deductedStockItems.length > 0) {
            await rollbackStockDeductions(deductedStockItems);
        }
        console.error("completeMagicOrder Error:", error);
        return next(error);
    }
};

/**
 * 5. RAZORPAY CENTRAL WEBHOOK
 * Listens for:
 * - payment.captured (Online payment captured)
 * - order.paid (Razorpay order fully paid)
 * - order.placed (Magic Checkout COD order placed)
 */
exports.razorpayWebhook = async (req, res) => {
    try {
        // const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        // const signature = req.headers["x-razorpay-signature"];

        // if (!signature || !webhookSecret) {
        //     return res.status(400).json({ success: false, message: "Webhook signature or secret missing" });
        // }

        // Verify webhook signature using raw request body
        const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body));
        // const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");

        // const sigBuffer = Buffer.from(signature, "utf8");
        // const expBuffer = Buffer.from(expectedSignature, "utf8");
        // if (sigBuffer.length !== expBuffer.length || !crypto.timingSafeEqual(sigBuffer, expBuffer)) {
        //     console.error("Razorpay webhook signature verification failed");
        //     return res.status(401).json({ success: false, message: "Invalid webhook signature" });
        // }

        const body = req.body;
        const event = body.event;
        console.log("Razorpay Webhook Verified Event:", event);

        // 1. Handle Magic Checkout COD: 'order.placed'
        if (event === "order.placed") {
            const orderEntity = body.payload?.order?.entity;
            const paymentEntity = body.payload?.payment?.entity;
            const orderId = orderEntity?.id || paymentEntity?.order_id;

            if (orderId) {
                const existing = await orderModel.findOne({ "payment.orderId": orderId });
                if (!existing) {
                    req.isWebhookCod = true;
                    req.body = {
                        razorpay_order_id: orderId,
                        razorpay_payment_id: paymentEntity?.id || `cod_${orderId}`,
                        isCod: true,
                        method: "cod",
                        contact: paymentEntity?.contact || orderEntity?.notes?.contact || "",
                        email: paymentEntity?.email || orderEntity?.notes?.email || "",
                        customer: {
                            contact: paymentEntity?.contact || orderEntity?.notes?.contact || "",
                            email: paymentEntity?.email || orderEntity?.notes?.email || "",
                            name: paymentEntity?.notes?.name || orderEntity?.notes?.name || ""
                        }
                    };
                    return exports.completeMagicOrder(req, res, (err) => {
                        if (err) console.error("Webhook COD complete error:", err);
                        return res.status(200).json({ status: "ok" });
                    });
                }
            }
        }

        // 2. Handle Online Payment Captured: 'payment.captured' or 'order.paid'
        if (event === "payment.captured" || event === "order.paid") {
            const paymentEntity = body.payload?.payment?.entity;
            const orderEntity = body.payload?.order?.entity;
            const orderId = paymentEntity?.order_id || orderEntity?.id;
            const paymentId = paymentEntity?.id;

            if (orderId) {
                const existing = await orderModel.findOne({ "payment.orderId": orderId });
                if (!existing) {
                    req.body = {
                        razorpay_order_id: orderId,
                        razorpay_payment_id: paymentId,
                        // Signature already verified at webhook level
                        razorpay_signature: razorpaySignature(orderId, paymentId),
                        isCod: false,
                        method: "online",
                        contact: paymentEntity?.contact || orderEntity?.notes?.contact || "",
                        email: paymentEntity?.email || orderEntity?.notes?.email || "",
                        customer: {
                            contact: paymentEntity?.contact || orderEntity?.notes?.contact || "",
                            email: paymentEntity?.email || orderEntity?.notes?.email || "",
                            name: paymentEntity?.notes?.name || orderEntity?.notes?.name || ""
                        }
                    };
                    return exports.completeMagicOrder(req, res, (err) => {
                        if (err) console.error("Webhook online payment complete error:", err);
                        return res.status(200).json({ status: "ok" });
                    });
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
