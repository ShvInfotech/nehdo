const orderModel = require("../../../model/order.model")



exports.GetOrders = async(req,res,next)=>{
    try {
const orders = await orderModel.find({ userId: req.user._id }).sort({ createdAt: -1 });

const updatedOrders = orders.map(order => ({
    ...order.toObject(),
    items: order.items.map(item => ({
        ...item.toObject(),
        image: item.image
            ? `http://${process.env.HOST}:${process.env.PORT}${item.image}`
            : ''
    }))
}));


        return res.status(200).json({success:true,message:'get orders',orders:updatedOrders})
    } catch (error) {
        return next(error)
    }
}