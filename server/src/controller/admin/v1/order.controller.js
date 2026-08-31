const { default: mongoose } = require("mongoose");
const { CustomeError } = require("../../../middleware/globelError");
const orderModel = require("../../../model/order.model");
const orderRequestsModel = require('../../../model/orderRequests.model')
const { getshippingcharg, CreatOrderINShiproket, AssignCourierAndAWB, GenerateLabel } = require("../../../services/shiproketapis");
const { label } = require("framer-motion/client");


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
                                                { $concat: [`http://${process.env.HOST}:${process.env.PORT}`, "$$item.image"] },
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
                    pickup_location: 'Home',
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
                    order:1,
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
                                        `http://${process.env.HOST}:${process.env.PORT}`,
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


        console.log(req.body)
        // return
        const apiKey = req.headers["x-api-key"];

        if (apiKey !== "123456abc") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized webhook"
            });
        }

        console.log("webhook call", req.body)
        const {
            awb,
            current_status,
            order_id,
            sr_order_id
        } = req.body;

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
        const updateorder = await orderModel.findOneAndUpdate(filter, { status: newStatus, trackingNumber: generateRandom6Digit() }, { returnDocument: 'after' })
        if (newStatus === "delivered" && updateorder.payment.method == "cod" && updateorder.payment.status == "pending") {
            await orderModel.findByIdAndUpdate(updateorder._id, { $set: { "payment.status": "paid", deliveredAt: Date.now() } });
        } else if (newStatus === "delivered") {
            await orderModel.findByIdAndUpdate(updateorder._id, { $set: { deliveredAt: Date.now() } });
        }
        return res.json(true)
    } catch (error) {
        return next(error)
    }
}