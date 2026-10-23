const mongoose = require("mongoose");
const orderModel = require("../../../model/order.model");
const orderRequestsModel = require('../../../model/orderRequests.model')
const crypto = require("crypto");
const { CustomeError } = require("../../../middleware/globelError");
const { RazorpayRefundApi } = require("../../../services/razorpayapi");
const { getshippingcharg, CreatOrderINShiproket, AssignCourierAndAWB, GenerateLabel } = require("../../../services/shiproketapis");


exports.PendingOrder = async (req, res, next) => {
    try {
        const orders = await orderModel.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    orderNumber: 1,
                    userId: 1,
                    "user.name": 1,
                    "user.email": 1,
                    "user.phone": 1,
                    items: {
                        $map: {
                            input: "$items",
                            as: "item",
                            in: {
                                $mergeObjects: [
                                    "$$item",
                                    {
                                        image: {
                                            $cond: [
                                                { $ne: ["$$item.image", null] },
                                                { $concat: [process.env.BACKEND_DOMIN_URL, "$$item.image"] },
                                                null
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    shippingAddress: 1,
                    payment: 1,
                    subtotal: 1,
                    discount: 1,
                    shippingCharge: 1,
                    trackingNumber: 1,
                    shiprocketOrderId: 1,
                    shiprocketShipmentId: 1,
                    totalAmount: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1

                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);

        return res.status(200).json({ success: true, message: 'get order', orders })

    } catch (error) {
        return next(error)
    }
}


exports.AccepteOrder = async (req, res, next) => {
    try {
        if (!req.body?.orderIds && !req.body.orderIds.length) {
            return next(CustomeError(422, "order id not provide"))
        }

        const orders = await orderModel.aggregate([
            {
                $match: {
                    _id: {
                        $in: req.body.orderIds.map(id => new mongoose.Types.ObjectId(id))
                    },
                    status: "pending"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    orderNumber: 1,
                    userId: 1,
                    items: 1,
                    shippingAddress: 1,
                    subtotal: 1,
                    discount: 1,
                    shippingCharge: 1,
                    totalAmount: 1,
                    payment: 1,
                    status: 1,
                    createdAt: 1,

                    user: {
                        name: "$user.name",
                        email: "$user.email",
                        phone: "$user.phone"
                    }
                }
            }
        ]);

        for (const order of orders) {

            const length = Math.max(...order.items.map(item => Number(item.dimensions?.length || 0)), 0);
            const breadth = Math.max(...order.items.map(item => Number(item.dimensions?.width || 0)), 0);
            const height = order.items.reduce((total, item) => total + Number(item.dimensions?.height || 0) * Number(item.quantity || 1), 0);
            const weight = order.items.reduce((total, item) => total + Number(item.weight || 0) * Number(item.quantity || 1), 0);

            const packageDetails = {
                pincode: order.shippingAddress.postalCode,
                weight,
                cod: order.payment.method === "cod" ? 1 : 0,
                length,
                breadth,
                height
            };


            const data = await getshippingcharg(packageDetails);

            if (data.status === 400 || data.status === 404) {
                return next(CustomeError(data.status, data.message))
            }

            const bestCourier = data.data.available_courier_companies.reduce((best, current) => current.rate < best.rate ? current : best);

            const courierDetails = {
                courierCompanyId: bestCourier.courier_company_id,
                courierId: bestCourier.id,
                courierName: bestCourier.courier_name,
                rate: bestCourier.rate,
                freightCharge: bestCourier.freight_charge,
                chargeWeight: bestCourier.charge_weight,
                estimatedDeliveryDays: bestCourier.estimated_delivery_days,
                etd: bestCourier.etd,
                zone: bestCourier.zone
            };

            // અહીં order પ્રમાણે courier store/use કરી શકો

            const order_items = order.items.map(item => ({
                name: item.name,
                sku: item.sku,
                units: Number(item.quantity),
                selling_price: Number(item.price),
                discount: 0,
                tax: 0,
                hsn: item.HSCode || ""
            })),


                createorderData = {
                    order_id: order.orderNumber,
                    order_date: new Date(order.createdAt).toISOString().slice(0, 16).replace("T", " "),
                    pickup_location: process.env.SHIPROKET_PICKUP_LOCATION || "HOME",
                    channel_id: "",
                    comment: "Test order",

                    billing_customer_name: order.user.name,
                    billing_last_name: order.user.name,
                    billing_address: order.shippingAddress.addressline,
                    billing_address_2: order.shippingAddress.landmark,
                    billing_city: order.shippingAddress.city,
                    billing_pincode: order.shippingAddress.postalCode,
                    billing_state: order.shippingAddress.state,
                    billing_country: "India",
                    billing_email: order.user.email,
                    billing_phone: order.user.phone,

                    shipping_is_billing: true,
                    order_items,
                    payment_method: order.payment?.method === "cod" ? "COD" : "Prepaid",
                    shipping_charges: 0,
                    giftwrap_charges: 0,
                    transaction_charges: 0,
                    total_discount: 0,
                    sub_total: order.totalAmount,
                    length,
                    breadth,
                    height,
                    weight
                }




            const confirmorderData = await CreatOrderINShiproket(createorderData)

            const awsData = {
                shipment_id: confirmorderData.shipment_id,
                courier_id: courierDetails.courierId,

            }
            const awsNumber = await AssignCourierAndAWB(awsData)    // pending aws not provide by shiproket in test mode 

            if (!awsNumber.data?.errors) {
                await orderModel.findByIdAndUpdate(order._id, { shiprocketOrderId: confirmorderData.order_id, shiprocketShipmentId: confirmorderData.shipment_id, trackingNumber: awsNumber.awb_code, status: 'accepted' })
            }

            // await orderModel.findByIdAndUpdate(order._id, { shiprocketOrderId: confirmorderData.order_id, shiprocketShipmentId: confirmorderData.shipment_id, trackingNumber: '123456', status: 'accepted' })

        }

        return res.status(200).json({ success: true, message: "Order Accepted", orders })
    } catch (error) {
        console.log(
            "Shiprocket Error:",
            JSON.stringify(error.response?.data, null, 2)
        );

        console.log(
            "Shiprocket Errors:",
            JSON.stringify(error.response?.data?.errors, null, 2)
        );
        return next(error)
    }
}



exports.GanrateLabel = async (req, res, next) => {
    try {

        if (!req.body?.shipmentIds && !req.body?.shipmentIds?.length) {
            return CustomeError(422, "shipmentId not provide")
        }
        console.log(req.body?.shipmentIds)
        const respons = await GenerateLabel(req.body?.shipmentIds)
        

        const notCreatedShipmentIds = Object.keys(respons.not_created);
        const successfulShipmentIds = req.body?.shipmentIds.filter((shipmentId) => !notCreatedShipmentIds.includes(String(shipmentId)));




        const updateOrders = await orderModel.updateMany(
            { shiprocketShipmentId: { $in: successfulShipmentIds }, status: "accepted" },
            { $set: { status: "processing" } }
        );

        console.log("Updated orders:", updateOrders.modifiedCount);

        return res.status(200).json({ success: true, message: `label Genareted`,label_url:respons?.label_url  })

    } catch (error) {
        return next(error)
    }
}


exports.CanceledOrderRequest = async (req, res, next) => {
    try {



        const orders = await orderRequestsModel.aggregate([


            // Order details
            {
                $lookup: {
                    from: "orders",
                    localField: "orderId",
                    foreignField: "_id",
                    as: "orderData",
                },
            },

            {
                $unwind: {
                    path: "$orderData",
                    preserveNullAndEmptyArrays: true,
                },
            },

            // User details
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },

            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },

            // Response structure
            {
                $project: {
                    _id: 1,
                    orderId: 1,
                    userId: 1,
                    type: 1,
                    initiatedBy: 1,
                    reason: 1,
                    status: 1,
                    completedAt: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    refund: 1,
                    order: 1,
                    orderNumber: "$orderData.orderNumber",

                    user: {
                        _id: "$user._id",
                        name: "$user.name",
                        email: "$user.email",
                        phone: "$user.phone",
                        profile: {
                            $cond: [
                                {
                                    $and: [
                                        { $ne: ["$user.profile", null] },
                                        { $ne: ["$user.profile", ""] },
                                    ],
                                },
                                {
                                    $concat: [
                                        process.env.BACKEND_DOMIN_URL,
                                        "$user.profile",
                                    ],
                                },
                                null,
                            ],
                        },
                    },
                },
            },

            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]);

        return res.status(200).json({ success: true, message: "Get canceled return rto order", orders, });






    } catch (error) {
        return next(error)
    }
}








exports.RefundWebhook = async (req, res, next) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        const signature = req.headers["x-razorpay-signature"];

        if (!signature) {
            return res.status(400).json({
                success: false,
                message: "Razorpay webhook signature missing",
            });
        }

        // req.body is currently an Object
        const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body));

        const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");

        if (expectedSignature !== signature) {
            return res.status(401).json({
                success: false,
                message: "Invalid Razorpay webhook signature",
            });
        }

        const body = Buffer.isBuffer(req.body) ? JSON.parse(req.body.toString("utf8")) : req.body;


        if (body.event === 'refund.created') {

            await orderRequestsModel.findOneAndUpdate({ "refund.paymentId": body.payload.refund.entity?.payment_id, "refund.status": "pending" }, { $set: { "refund.status": "processing" } }, { returnDocument: 'after' });
            console.log("refund.created")
        }

        if (body.event === 'refund.processed') {
            await orderRequestsModel.findOneAndUpdate({ "refund.paymentId": body.payload.refund.entity?.payment_id }, { $set: { "refund.status": "processed", "refund.refundedAt": Date.now() } }, { returnDocument: 'after' });
            console.log("refund.processed")

        }


        if (body.event === 'refund.failed') {
            await orderRequestsModel.findOneAndUpdate({ "refund.paymentId": body.payload.refund.entity?.payment_id }, { $set: { "refund.status": "failed" } }, { returnDocument: 'after' });
            console.log("refund.failed")

        }
        return res.status(200).json({ success: true })
    } catch (error) {
        console.error("Refund Webhook Error:", error);
        return next(error);
    }
};



const mapShiprocketStatusToOrderStatus = (status, statusId) => {
    // 1. By status ID (Shiprocket internal tracking status IDs)
    if (statusId !== undefined && statusId !== null) {
        const idNum = Number(statusId);
        const idMap = {
            1: "processing",        // AWB Assigned
            2: "processing",        // Label Generated
            3: "processing",        // Pickup Scheduled
            4: "processing",        // Pickup Rescheduled
            5: "processing",        // Pickup Error
            13: "processing",       // Pickup Exception
            15: "processing",       // Out for Pickup
            21: "processing",       // Reached Pickup Hub

            11: "pending",          // Pending / Unshipped

            6: "shipped",           // Shipped
            17: "shipped",          // In Transit
            18: "shipped",          // Reached at Destination Hub
            19: "shipped",          // Misrouted
            22: "shipped",          // Reached Origin Hub
            23: "shipped",          // Picked Up
            42: "shipped",          // Reached Delivery Hub

            16: "out_for_delivery", // Out for Delivery

            7: "delivered",         // Delivered

            8: "cancelled",         // Cancelled
            9: "cancelled",         // RTO Initiated
            10: "cancelled",        // RTO Delivered
            12: "cancelled",        // Lost
            20: "cancelled",        // RTO Acknowledged
            43: "cancelled",        // Shipment Lost
            44: "cancelled"         // Shipment Damaged
        };

        if (idMap[idNum]) {
            return idMap[idNum];
        }
    }

    // 2. By string status name
    if (!status || typeof status !== "string") return null;
    const normalized = status.trim().toUpperCase().replace(/[_-]/g, " ");

    const textMap = {
        // Pending
        "NEW": "pending",
        "PENDING": "pending",

        // Accepted / Processing
        "ACCEPTED": "accepted",
        "CONFIRMED": "accepted",
        "ORDER CONFIRMED": "accepted",
        "AWB ASSIGNED": "processing",
        "LABEL GENERATED": "processing",
        "MANIFEST GENERATED": "processing",
        "PICKUP GENERATED": "processing",
        "PICKUP SCHEDULED": "processing",
        "PICKUP QUEUED": "processing",
        "PICKUP RESCHEDULED": "processing",
        "OUT FOR PICKUP": "processing",
        "PICKUP ERROR": "processing",
        "PICKUP EXCEPTION": "processing",
        "REACHED PICKUP HUB": "processing",
        "PACKED": "processing",
        "PROCESSING": "processing",
        "READY TO SHIP": "processing",

        // Shipped
        "PICKED UP": "shipped",
        "IN TRANSIT": "shipped",
        "SHIPPED": "shipped",
        "DISPATCHED": "shipped",
        "IN FLIGHT": "shipped",
        "REACHED AT DESTINATION": "shipped",
        "REACHED AT DESTINATION HUB": "shipped",
        "REACHED DESTINATION HUB": "shipped",
        "REACHED ORIGIN HUB": "shipped",
        "REACHED DELIVERY HUB": "shipped",
        "TRANSIT": "shipped",
        "MISROUTED": "shipped",

        // Out for Delivery
        "OUT FOR DELIVERY": "out_for_delivery",
        "OUT FOR DELIVERY TODAY": "out_for_delivery",

        // Delivered
        "DELIVERED": "delivered",
        "COMPLETED": "delivered",

        // Cancelled / RTO
        "CANCEL": "cancelled",
        "CANCELED": "cancelled",
        "CANCELLED": "cancelled",
        "LOST": "cancelled",
        "SHIPMENT LOST": "cancelled",
        "SHIPMENT DAMAGE": "cancelled",
        "SHIPMENT DAMAGED": "cancelled",
        "DAMAGED": "cancelled",
        "RTO INITIATED": "cancelled",
        "RTO IN TRANSIT": "cancelled",
        "RTO DELIVERED": "cancelled",
        "RTO ACKNOWLEDGED": "cancelled",
        "RTO CANCELLED": "cancelled",
        "RTO": "cancelled",
        "RETURN DELIVERED": "cancelled"
    };

    return textMap[normalized] || null;
};

const handleShippingWebhookLogic = async (req, res, next, requireAuth = true) => {
    try {
        if (requireAuth && process.env.SHIPROKET_WEBHOOK_API_KEY) {
            const rawApiKey = req.headers["x-api-key"] || req.headers["x-api-token"] || req.headers["authorization"];
            const expectedKey = process.env.SHIPROKET_WEBHOOK_API_KEY.trim();
            const cleanApiKey = rawApiKey ? rawApiKey.replace(/^Bearer\s+/i, "").trim() : "";

            if (cleanApiKey !== expectedKey) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized webhook"
                });
            }
        }

        const payload = Array.isArray(req.body) ? req.body[0] : req.body;
        console.log("Shiprocket Webhook received:", JSON.stringify(payload));

        if (!payload || typeof payload !== "object") {
            return res.status(400).json({ success: false, message: "Invalid webhook payload" });
        }

        const rawStatus = (payload.current_status || payload.shipment_status || payload.status || "").toString().trim().toUpperCase();
        const rawStatusId = payload.current_status_id || payload.shipment_status_id;

        // Check if shipment is RTO, Customer Return, or Forward
        const isRTO = rawStatus.startsWith("RTO") || rawStatus.includes("RTO") || String(rawStatusId) === "9" || String(payload.shipment_status_id) === "9";
        const isReturn = !isRTO && (payload.is_return == 1 || payload.is_return === "1" || payload.is_return === true || rawStatus.startsWith("RETURN"));

        // Build search conditions to reliably find the matching order
        const searchConditions = [];
        if (payload.sr_order_id) {
            searchConditions.push({ shiprocketOrderId: String(payload.sr_order_id) });
        }
        if (payload.shipment_id) {
            searchConditions.push({ shiprocketShipmentId: String(payload.shipment_id) });
        }
        if (payload.order_id) {
            searchConditions.push({ orderNumber: String(payload.order_id) });
            searchConditions.push({ shiprocketOrderId: String(payload.order_id) });
        }
        if (payload.channel_order_id) {
            searchConditions.push({ orderNumber: String(payload.channel_order_id) });
        }
        if (payload.awb) {
            searchConditions.push({ trackingNumber: String(payload.awb) });
        }
        if (payload.return_awb_code) {
            searchConditions.push({ trackingNumber: String(payload.return_awb_code) });
        }

        let order = null;
        if (searchConditions.length > 0) {
            order = await orderModel.findOne({ $or: searchConditions });
        }

        // Fallback: If order not found directly, check existing orderRequests
        if (!order) {
            const reqSearch = [];
            if (payload.sr_order_id) reqSearch.push({ "order.shiprocketOrderId": String(payload.sr_order_id) });
            if (payload.order_id) reqSearch.push({ "order.shiprocketOrderId": String(payload.order_id) });
            if (payload.awb) reqSearch.push({ "order.trackingNumber": String(payload.awb) });
            if (payload.return_awb_code) reqSearch.push({ "order.trackingNumber": String(payload.return_awb_code) });

            if (reqSearch.length > 0) {
                const existingReq = await orderRequestsModel.findOne({ $or: reqSearch });
                if (existingReq?.orderId) {
                    order = await orderModel.findById(existingReq.orderId);
                }
            }
        }

        // ======================= 1. RTO SHIPMENT =======================
        if (isRTO) {
            const rtoFilter = {
                type: "rto",
                $or: [
                    ...(order ? [{ orderId: order._id }] : []),
                    ...(payload.sr_order_id ? [{ "order.shiprocketOrderId": String(payload.sr_order_id) }] : []),
                    ...(payload.order_id ? [{ "order.shiprocketOrderId": String(payload.order_id) }] : []),
                    ...(payload.awb ? [{ "order.trackingNumber": String(payload.awb) }] : []),
                    ...(payload.return_awb_code ? [{ "order.trackingNumber": String(payload.return_awb_code) }] : [])
                ]
            };

            let existingRto = null;
            if (rtoFilter.$or.length > 0) {
                existingRto = await orderRequestsModel.findOne(rtoFilter);
            }

            if (!existingRto) {
                if (!order) {
                    console.warn("ShippingWebhook: Order not found for RTO:", {
                        awb: payload.awb,
                        sr_order_id: payload.sr_order_id,
                        order_id: payload.order_id
                    });
                    return res.status(200).json({ success: false, message: "Order not found for RTO initiation" });
                }

                let paymentdata = {
                    isRequired: order.payment?.status === "paid",
                    provider: order.payment?.method === "online" ? "razorpay" : "manual",
                    paymentId: order.payment?.paymentId || null,
                    refundId: null,
                    amount: order.totalAmount || 0,
                    status: order.payment?.status === "paid" ? "pending" : "not_required",
                    refundedAt: null,
                };

                let orderData = {
                    orderId: order._id,
                    userId: order.userId,
                    type: "rto",
                    initiatedBy: "courier",
                    reason: payload.undelivered_reason || "Courier undelivered / RTO",
                    status: rawStatus === "RTO DELIVERED" ? "completed" : "processing",
                    completedAt: rawStatus === "RTO DELIVERED" ? Date.now() : null,
                };

                let returnOrderData = {
                    status: payload.current_status || rawStatus,
                    shiprocketOrderId: String(payload.sr_order_id || order.shiprocketOrderId || ""),
                    shiprocketShipmentId: String(payload.shipment_id || order.shiprocketShipmentId || ""),
                    trackingNumber: payload.return_awb_code || payload.awb || order.trackingNumber || null,
                    deliveredAt: rawStatus === "RTO DELIVERED" ? new Date() : null,
                };

                if (order.payment?.method === "online" && order.payment?.status === "paid") {
                    try {
                        let refundRes = await RazorpayRefundApi(order);
                        paymentdata.paymentId = refundRes.payment_id;
                        paymentdata.status = refundRes.status === "pending" ? "processing" : refundRes.status;
                        paymentdata.refundId = refundRes.id;

                        if (refundRes.status === "processed") {
                            paymentdata.status = "processed";
                            paymentdata.refundedAt = Date.now();
                            await orderModel.findByIdAndUpdate(order._id, { "payment.status": "refunded" });
                        }
                    } catch (refundError) {
                        console.error("Razorpay RTO Refund Error:", refundError);
                    }
                }

                const requestData = {
                    ...orderData,
                    refund: paymentdata,
                    order: returnOrderData
                };

                existingRto = await orderRequestsModel.create(requestData);
                await orderModel.findByIdAndUpdate(order._id, { status: "cancelled" });

                return res.status(200).json({
                    success: true,
                    message: `RTO Initiated and order cancelled (${payload.current_status || rawStatus})`,
                    orderId: order._id
                });
            }

            // Existing RTO record found - update its status
            const updateFields = {
                "order.status": payload.current_status || rawStatus
            };
            if (payload.return_awb_code) {
                updateFields["order.trackingNumber"] = String(payload.return_awb_code);
            }
            if (payload.undelivered_reason && !existingRto.reason) {
                updateFields.reason = payload.undelivered_reason;
            }

            if (rawStatus === "RTO DELIVERED") {
                updateFields.completedAt = Date.now();
                updateFields.status = "completed";
                updateFields["order.deliveredAt"] = new Date();
            }

            await orderRequestsModel.findByIdAndUpdate(existingRto._id, { $set: updateFields });

            if (order && order.status !== "cancelled") {
                await orderModel.findByIdAndUpdate(order._id, { status: "cancelled" });
            }

            return res.status(200).json({
                success: true,
                message: `RTO status updated: ${payload.current_status || rawStatus}`,
                requestId: existingRto._id
            });
        }

        // ======================= 2. CUSTOMER RETURN SHIPMENT =======================
        else if (isReturn) {
            const returnFilter = {
                type: "return",
                $or: [
                    ...(order ? [{ orderId: order._id }] : []),
                    ...(payload.sr_order_id ? [{ "order.shiprocketOrderId": String(payload.sr_order_id) }] : []),
                    ...(payload.order_id ? [{ "order.shiprocketOrderId": String(payload.order_id) }] : []),
                    ...(payload.awb ? [{ "order.trackingNumber": String(payload.awb) }] : []),
                    ...(payload.return_awb_code ? [{ "order.trackingNumber": String(payload.return_awb_code) }] : [])
                ]
            };

            let existingReturn = null;
            if (returnFilter.$or.length > 0) {
                existingReturn = await orderRequestsModel.findOne(returnFilter);
            }

            if (rawStatus === "RETURN DELIVERED") {
                if (existingReturn) {
                    await orderRequestsModel.findByIdAndUpdate(existingReturn._id, {
                        $set: {
                            "order.status": payload.current_status || rawStatus,
                            completedAt: Date.now(),
                            status: "completed",
                            "order.deliveredAt": new Date()
                        }
                    });
                }
                return res.status(200).json({ success: true, message: "Return Delivered" });
            }

            if (rawStatus === "RETURN PICKED UP") {
                if (existingReturn) {
                    await orderRequestsModel.findByIdAndUpdate(existingReturn._id, {
                        $set: { "order.status": payload.current_status || rawStatus }
                    });

                    const orderDoc = order || (await orderModel.findById(existingReturn.orderId));
                    if (orderDoc && orderDoc.payment?.method === "online" && existingReturn.refund?.status !== "processed") {
                        try {
                            const refundData = await RazorpayRefundApi(orderDoc);
                            const paymentdata = {
                                ...(existingReturn.refund?.toObject ? existingReturn.refund.toObject() : existingReturn.refund),
                                paymentId: refundData.payment_id || orderDoc.payment?.paymentId,
                                status: refundData.status === "pending" ? "processing" : (refundData.status || "processing"),
                                refundId: refundData.id
                            };

                            if (refundData.status === "processed") {
                                paymentdata.status = "processed";
                                paymentdata.refundedAt = Date.now();
                                await orderModel.findByIdAndUpdate(orderDoc._id, { "payment.status": "refunded" });
                            }

                            await orderRequestsModel.findByIdAndUpdate(existingReturn._id, { refund: paymentdata });
                        } catch (refundErr) {
                            console.error("Razorpay Return Pickup Refund Error:", refundErr);
                        }
                    }
                }
                return res.status(200).json({ success: true, message: "Return Picked Up and refund processed" });
            }

            if (rawStatus === "RETURN CANCELLED") {
                if (existingReturn) {
                    await orderRequestsModel.findByIdAndUpdate(existingReturn._id, {
                        $set: { "order.status": payload.current_status || rawStatus }
                    });
                    if (existingReturn.orderId) {
                        await orderModel.findByIdAndUpdate(existingReturn.orderId, { status: "delivered" });
                    }
                }
                return res.status(200).json({ success: true, message: "Return Cancelled" });
            }

            if (existingReturn) {
                await orderRequestsModel.findByIdAndUpdate(existingReturn._id, {
                    $set: { "order.status": payload.current_status || rawStatus }
                });
            }
            return res.status(200).json({ success: true, message: "Return status updated" });
        }

        // ======================= 3. FORWARD SHIPMENT =======================
        else {
            if (!order) {
                console.warn("ShippingWebhook: Forward order not found for payload:", {
                    awb: payload.awb,
                    sr_order_id: payload.sr_order_id,
                    order_id: payload.order_id,
                    shipment_id: payload.shipment_id
                });
                return res.status(200).json({
                    success: false,
                    message: "Order not found in database"
                });
            }

            const newStatus = mapShiprocketStatusToOrderStatus(rawStatus, rawStatusId);
            const updateFields = {};

            if (newStatus) {
                updateFields.status = newStatus;

                if (newStatus === "delivered") {
                    if (!order.deliveredAt) {
                        updateFields.deliveredAt = new Date();
                    }
                    if (order.payment?.method === "cod" && order.payment?.status === "pending") {
                        updateFields["payment.status"] = "paid";
                    }
                }
            }

            if (payload.awb) {
                updateFields.trackingNumber = String(payload.awb);
                if (!order.trackingUrl) {
                    updateFields.trackingUrl = `https://shiprocket.co//tracking/${payload.awb}`;
                }
            }

            if (payload.sr_order_id && !order.shiprocketOrderId) {
                updateFields.shiprocketOrderId = String(payload.sr_order_id);
            }
            if (payload.shipment_id && !order.shiprocketShipmentId) {
                updateFields.shiprocketShipmentId = String(payload.shipment_id);
            }

            const updatedOrder = await orderModel.findByIdAndUpdate(
                order._id,
                { $set: updateFields },
                { returnDocument: 'after' }
            );

            return res.status(200).json({
                success: true,
                message: "Order shipping status updated successfully",
                orderId: order._id,
                orderNumber: order.orderNumber,
                status: updatedOrder.status
            });
        }
    } catch (error) {
        console.error("ShippingWebhook Error:", error);
        return next(error);
    }
};

exports.ShippingWebhook = async (req, res, next) => {
    return handleShippingWebhookLogic(req, res, next, true);
};

exports.ShippingWebhookTest = async (req, res, next) => {
    return handleShippingWebhookLogic(req, res, next, false);
};





