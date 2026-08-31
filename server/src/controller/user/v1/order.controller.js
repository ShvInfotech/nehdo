const { CustomeError } = require("../../../middleware/globelError");
const orderModel = require("../../../model/order.model");
const userModel = require("../../../model/user.model");
const { RazorpayRefundApi } = require("../../../services/razorpayapi");
const orderRequestsModel = require('../../../model/orderRequests.model');
const { ShiprocketCancel, getReturnshippingcharg, ShiproketReturnCreate, AssignCourierAndAWB } = require("../../../services/shiproketapis");


exports.GetOrders = async (req, res, next) => {
    try {
        const orders = await orderModel.find({ userId: req.user._id }).sort({ createdAt: -1 });

        const updatedOrders = orders.map(order => ({
            ...order.toObject(),
            items: order.items.map(item => ({
                ...item.toObject(),
                image: item.image ? `http://${process.env.HOST}:${process.env.PORT}${item.image}` : ''
            }))
        }));


        return res.status(200).json({ success: true, message: 'get orders', orders: updatedOrders })
    } catch (error) {
        return next(error)
    }
}


exports.CancelledOrder = async (req, res, next) => {
    try {
        if (!req.body?.orderId) {
            return next(CustomeError(422, "orderId is required"))
        }


        let order = await orderModel.findById(req.body?.orderId)


        if (!order) {
            return next(CustomeError(422, "order not found"))
        }

        const cancellResquet = await orderRequestsModel.findOne({ orderId: order._id, userId: order.userId })
        if (cancellResquet) {
            return next(CustomeError(400, "Order cancell resquet alredy proceesed"))
        }


        if (!["pending", "accepted", "processing"].includes(order.status)) {
            return next(CustomeError(400, "Order cannot be cancelled at this stage"))
        }


        if (order.shiprocketOrderId) {
            try {
                await ShiprocketCancel(order.shiprocketOrderId)
            } catch (error) {
                return next(error.message)
            }
        }

        let paymentdata = {
            isRequired: order.payment.status == "paid" ? true : false,
            provider: order.payment.method == "online" ? "razorpay" : null,
            paymentId: null,
            refundId: null,
            amount: order.totalAmount,
            status: order.payment.status == "paid" ? "pending" : "not_required",
            refundedAt: null,
        }



        let orderData = {
            orderId: order._id,
            userId: order.userId,
            type: "cancel",
            initiatedBy: "customer",
            reason: req.body.reason || "change my minde",
            status: "approved",
        }


        if (order.payment.method == "online") {

            let data = await RazorpayRefundApi(order)
            paymentdata.paymentId = data.payment_id
            paymentdata.status = data.status == "pending" ? "processing" : data.status
            paymentdata.refundId = data.id

            if (data.status == "processed") {
                orderData.completedAt = Date.now()
                paymentdata.refundedAt = Date.now()
                orderData.status = "completed"
            }
        } else {
            orderData.completedAt = Date.now()
            orderData.status = "completed"
        }


        const orderrequirestdata = {
            ...orderData,
            refund: { ...paymentdata }
        }

        const data = await orderRequestsModel.create(orderrequirestdata)

        await orderModel.findByIdAndUpdate(order._id,{status:"cancelled"})

        return res.status(200).json({ success: true, message: 'order cancelled successfully', data })

    } catch (error) {
        return next(error)
    }
}

exports.ReturnOrder = async (req, res, next) => {
    try {


        if (!req.body?.orderId) {
            return next(CustomeError(422, "orderId is required"))
        }


        let order = await orderModel.findById(req.body?.orderId)


        if (!order) {
            return next(CustomeError(422, "order not found"))
        }


        const deliveredAt = new Date(order.deliveredAt);
        const currentDate = new Date();

        const returnDeadline = new Date(deliveredAt);
        returnDeadline.setDate(returnDeadline.getDate() + 7);


        if (currentDate > returnDeadline) {
            return next(CustomeError(400, "Return period has expired. Return is available only within 7 days of delivery."))
        }


        if (!["delivered"].includes(order.status)) {
            return next(CustomeError(400, "Order cannot be retrun at this stage"))
        }

        const alreadyRequested = await orderRequestsModel.findOne({orderId:order._id}) 


        if(alreadyRequested){
            return next(CustomeError(400, "Order alreaqdy processed"))
        }



        if (order.payment.method == "cod" && order.payment.status == 'paid' && !req.body.bankDetails) {
            return next(CustomeError(422, 'bankDetails is required'))
        }

        const user = await userModel.findById(order.userId)



        const length = Math.max(...order.items.map(item => Number(item.dimensions?.length || 0)), 0);
        const breadth = Math.max(...order.items.map(item => Number(item.dimensions?.width || 0)), 0);
        const height = order.items.reduce((total, item) => total + Number(item.dimensions?.height || 0) * Number(item.quantity || 1), 0);
        const weight = order.items.reduce((total, item) => total + Number(item.weight || 0) * Number(item.quantity || 1), 0);


        const order_items = order.items.map(item => ({
            name: item.name,
            qc_enable: false,
            qc_product_name: item.name,
            sku: item.sku,
            units: Number(item.quantity),
            selling_price: Number(item.price),
            discount: 0,
            qc_product_image: `https://dad-panda-rocklike.ngrok-free.dev${item.image}`,

        }))

        const data = {
            order_id: order.shiprocketOrderId,
            order_date: new Date(order.createdAt).toISOString().slice(0, 16).replace("T", " "),
            payment_method: "PREPAID",
            pickup_customer_name: user.name,
            pickup_phone: user.phone,
            pickup_email: user.email,
            pickup_address: order.shippingAddress.addressline,
            pickup_address_2: order.shippingAddress.landmark,
            pickup_city: order.shippingAddress.city,
            pickup_pincode: order.shippingAddress.postalCode,
            pickup_state: order.shippingAddress.state,
            pickup_country: "India",

            shipping_customer_name: "Darshik Shekhada",
            shipping_email: "darshikshekhada07@gmail.com",
            shipping_phone: "9714920969",
            shipping_address: "243, Gopinath Society",
            shipping_address_2: "Ramnagar Rander",
            shipping_city: "surat",
            shipping_state: "gujarat",
            shipping_country: "India",
            shipping_pincode: "395005",

            order_items,
            sub_total: order.totalAmount,
            length: length,
            breadth: breadth,
            height: height,
            weight: weight


        }







        const confirmorderData = await ShiproketReturnCreate(data)

        if (!confirmorderData) {
            return next(CustomeError(400, "Try after some time"))
        }


        let shiping = await getReturnshippingcharg(confirmorderData.order_id)

        const bestCourier = shiping?.data?.available_courier_companies.reduce((best, current) => current.rate < best.rate ? current : best);

        if (!bestCourier) {

            return next(CustomeError(400, "Try after some time"))

        }
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



        const awsData = {
            shipment_id: confirmorderData.shipment_id,
            courier_id: courierDetails.courierId,
            is_return: 1
        }
        // const awsNumber = await AssignCourierAndAWB(awsData)    // pending aws not provide by shiproket in test mode 
        // console.log(awsNumber)



        let paymentdata = {
            isRequired: order.payment.status == "paid" ? true : false,
            provider: order.payment.method == "online" ? "razorpay" : "manual",
            paymentId: null,
            refundId: null,
            amount: order.totalAmount,
            status: order.payment.status == "paid" ? "pending" : "not_required",
            refundedAt: null,
        }



        let orderData = {
            orderId: order._id,
            userId: order.userId,
            type: "return",
            initiatedBy: "customer",
            reason: req.body.reason || "other",
            status: "processing",
        }

        let returnOrderData = {
            status: confirmorderData.status || "RETURN PENDING",
            shiprocketOrderId: confirmorderData.order_id,
            shiprocketShipmentId: confirmorderData.shipment_id,
            trackingNumber:  '12345' //awsNumber 
        }



        if (order.payment.method == "online") {

            let data = await RazorpayRefundApi(order)
            paymentdata.paymentId = data.payment_id
            paymentdata.status = data.status == "pending" ? "processing" : data.status
            paymentdata.refundId = data.id

            if (data.status == "processed") {
                paymentdata.status = "processed"
                paymentdata.refundedAt = Date.now()
            }
        } else {
            paymentdata.status = "processing"
            paymentdata.bankDetails = req.body.bankDetails
        }


        const orderRequestsData = {
            ...orderData,
            refund: { ...paymentdata },
            order: { ...returnOrderData }
        }

        const returnRequest = await orderRequestsModel.create(orderRequestsData)
        await orderModel.findByIdAndUpdate(order._id,{status:"cancelled"})

        return res.status(200).json({ success: true, message: "order return successfully", returnRequest })
    } catch (error) {
        return next(error)
    }
}