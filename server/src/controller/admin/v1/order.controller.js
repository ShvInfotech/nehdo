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
            // const awsNumber = await AssignCourierAndAWB(awsData)    // pending aws not provide by shiproket in test mode 
            // console.log(awsNumber.data.errors)

            await orderModel.findByIdAndUpdate(order._id, { shiprocketOrderId: confirmorderData.order_id, shiprocketShipmentId: confirmorderData.shipment_id, trackingNumber: '123456', status: 'accepted' })

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
        console.log(respons)

        const notCreatedShipmentIds = Object.keys(respons.not_created);
        const successfulShipmentIds = req.body?.shipmentIds.filter((shipmentId) => !notCreatedShipmentIds.includes(String(shipmentId)));



        const updateOrders = await orderModel.updateMany(
            { shiprocketShipmentId: { $in: req.body.shipmentIds }, status: "accepted" },
            { $set: { status: "processing" } }
        );

        // const updateOrders = await orderModel.updateMany(
        //     {shiprocketShipmentId: {$in: successfulShipmentIds},status: "accepted"},
        //     {$set: {status: "processing"}}
        // );

        console.log("Updated orders:", updateOrders.modifiedCount);

        return res.status(200).json({
            success: true, message: ` label Genareted`, label_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
        })
        // return res.status(200).json({ success: true, message: `label Genareted`,label_url:respons?.label_url  })

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



exports.ShippingWebhook = async (req, res, next) => {
    try {
        const apiKey = req.headers["x-api-key"];

        if (apiKey !== process.env.SHIPROKET_WEBHOOK_API_KEY) {
            return res.status(401).json({
                success: false, message: "Unauthorized webhook"
            });
        }

        console.log("webhook call", req.body)

        if (req.body.is_return == 0) {


            const { awb, current_status, sr_order_id } = req.body;

            const statusMap = {
                "NEW": "pending",
                "PICKUP GENERATED": "processing",
                "OUT FOR PICKUP": "processing",
                "PICKED UP": "shipped",
                "IN TRANSIT": "shipped",
                "OUT FOR DELIVERY": "out_for_delivery",
                "DELIVERED": "delivered",
                "CANCELED": "cancelled",
                "CANCELLED": "cancelled"
            };
            const newStatus = statusMap[current_status?.toUpperCase()];
            const generateRandom6Digit = () => {
                return Math.floor(100000 + Math.random() * 900000);
            };


            const filter = awb ? { trackingNumber: awb } : { shiprocketOrderId: sr_order_id };
            const updateorder = await orderModel.findOneAndUpdate(filter, { status: newStatus, trackingNumber: generateRandom6Digit() }, { returnDocument: 'after' }) // remove tracking number after 
            if (newStatus === "delivered" && updateorder?.payment?.method == "cod" && updateorder?.payment?.status == "pending") {
                await orderModel.findByIdAndUpdate(updateorder._id, { $set: { "payment.status": "paid", deliveredAt: Date.now() } });
            } else if (newStatus === "delivered") {
                await orderModel.findByIdAndUpdate(updateorder?._id, { $set: { deliveredAt: Date.now() } });
            }
            return res.json(true)

        } else if (req.body.is_return == 1) {
            let requestType = null;

            if (req.body?.current_status === "RTO INITIATED" || req.body?.current_status === "RTO IN TRANSIT" || req.body?.current_status === "RTO DELIVERED" || req.body?.current_status === "RTO CANCELLED") {
                requestType = "rto";

                if (req.body?.current_status === "RTO INITIATED") {
                    const oldorder = await orderModel.findOne({ shiprocketOrderId: req.body?.order_id })

                    let paymentdata = {
                        isRequired: oldorder.payment.status == "paid" ? true : false,
                        provider: oldorder.payment.method == "online" ? "razorpay" : "manual",
                        paymentId: null,
                        refundId: null,
                        amount: oldorder.totalAmount,
                        status: oldorder.payment.status == "paid" ? "pending" : "not_required",
                        refundedAt: null,
                    }

                    let orderData = {
                        orderId: oldorder._id,
                        userId: oldorder.userId,
                        type: "rto",
                        initiatedBy: "courier",
                        reason: req.body?.undelivered_reason || "othe",
                        status: "processing",
                    }

                    let returnOrderData = {
                        status: req.body?.current_status,
                        shiprocketOrderId: req.body?.sr_order_id,
                        shiprocketShipmentId: req.body?.shipment_id || oldorder.shiprocketShipmentId,
                        trackingNumber: req.body?.return_awb_code
                    }



                    if (oldorder.payment.method == "online") {

                        let data = await RazorpayRefundApi(oldorder)
                        paymentdata.paymentId = data.payment_id
                        paymentdata.status = data.status == "pending" ? "processing" : data.status
                        paymentdata.refundId = data.id

                        if (data.status == "processed") {
                            paymentdata.status = "processed"
                            paymentdata.refundedAt = Date.now()
                        }
                    }


                    const requestData = {
                        ...orderData,
                        refund: paymentdata,
                        order: returnOrderData
                    }


                    await orderRequestsModel.create(requestData)
                    await orderModel.findByIdAndUpdate(oldorder._id, { status: "cancelled" })
                    return res.status(200)
                }

                if (req.body?.current_status === "RTO DELIVERED") {

                    const requestorder = await orderRequestsModel.findOneAndUpdate({ "order.shiprocketOrderId": String(req.body?.sr_order_id), }, { "order.status": req.body?.current_status, completedAt: Date.now() }, { returnDocument: 'after', });
                    return res.status(200)

                }


                const requestorder = await orderRequestsModel.findOneAndUpdate({ "order.shiprocketOrderId": String(req.body?.sr_order_id), }, { "order.status": req.body?.current_status, }, { returnDocument: 'after', });
                return res.status(200)

            } else {
                requestType = "return";


                if (req.body?.current_status == "RETURN DELIVERED") {
                    const requestorder = await orderRequestsModel.findOneAndUpdate({ "order.shiprocketOrderId": String(req.body?.sr_order_id), }, { "order.status": req.body?.current_status, completedAt: Date.now() }, { returnDocument: 'after', });
                    return res.status(200)
                }


                const requestorder = await orderRequestsModel.findOneAndUpdate({ "order.shiprocketOrderId": String(req.body?.sr_order_id), }, { "order.status": req.body?.current_status, }, { returnDocument: 'after', });
                return res.status(200)

            }

            //             {
            //   awb: '',
            //   courier_name: null,
            //   current_status: 'RETURN CANCELLED',
            //   current_status_id: 27,
            //   shipment_status: 'CANCELLED',
            //   shipment_status_id: 8,
            //   return_awb_code: '',
            //   current_timestamp: '01 09 2026 11:11:29',
            //   order_id: '1554644142',
            //   sr_order_id: 1554838313,
            //   pickup_address_id: null,
            //   charge_info: null,
            //   awb_assigned_date: null,
            //   pickup_scheduled_date: null,
            //   etd: ' ',
            //   pickup_exception_reason: '',
            //   undelivered_reason: '',
            //   undelivered_reason_code: '',
            //   pick_exception_reason_code: '',
            //   delivery_attempt_count: 0,
            //   pickup_attempt_count: 0,
            //   qc_image: '',
            //   qc_failure_reason: '',
            //   scans: null,
            //   date: '',
            //   is_return: 1,
            //   channel_id: 11593266,
            //   pod_status: 'OTP Based Delivery',
            //   pod: 'Available',
            //   delivered_date: '',
            //   shipping_method: 'SR'
            // }
        }
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

        // console.log("====================================");
        // console.log("RAZORPAY REFUND WEBHOOK VERIFIED");
        // console.log("====================================");

        // console.log("body data", body)
        // console.log("payment entry", body.payload.payment.entity)
        // console.log("refund entry", body.payload.refund.entity)


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