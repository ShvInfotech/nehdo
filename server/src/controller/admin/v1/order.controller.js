const orderModel = require("../../../model/order.model")


exports.PendingOrder = async(req,res,next)=>{
    try {
        const orders = await orderModel.find({status:'pending'})
        return res.json(orders)
    } catch (error) {
        return next(error)
    }
}