const mongoose = require("mongoose")
const { CustomeError } = require("../../../middleware/globelError")
const cartModel = require("../../../model/cart.model")
const { GetCartPipeline } = require("../../../helper/aggretionpipeline")


exports.AddCart = async (req, res, next) => {
    try {
        if (!req.body?.productId) {
            return next(CustomeError(422, 'product id is required'))
        }

        if (!mongoose.isValidObjectId(req.body?.productId)) {
            return next(CustomeError(422, 'product id is invalid'))
        }
        if (!req.body?.size) {
            return next(CustomeError(422, 'size is required'))
        }

        if (!req.body?.color) {
            return next(CustomeError(422, 'color is required'))

        }

        if (!req.body?.quantity) {
            return next(CustomeError(422, 'quantity is quantity'))
        }


        let cart = await cartModel.findOneAndUpdate({ userId: req.user._id, productId: req.body.productId }, { $inc: { quantity: 1 } }, { returnDocument: 'after' });

        if (!cart) {
            cart = await cartModel.create({ ...req.body, userId: req.user._id })
        }

        return res.status(200).json({ success: true, message: "product add to cart", cart })

    } catch (error) {
        return next(error)
    }
}


exports.Getcart = async (req, res, next) => {
    try {
        const carts = await cartModel.aggregate(GetCartPipeline(req.user._id))
        return res.status(200).json({ success: true, message: "get carts", carts })
    } catch (error) {
        return next(error)
    }
}

exports.Updatecart = async (req, res, next) => {
    try {
        const id = req.params.id
        if (!mongoose.isValidObjectId(id)) {
            return next(CustomeError(409, "cart id is invalid"))
        }

        if (req.body?.quantity == null) {
            return next(CustomeError(422, "quantity is required"));
        }
        let cart = await cartModel.findById(id)
        if (!cart) {
            return next(CustomeError(404, "cart not found"))
        }
        if (req.body?.quantity) {
            cart = await cartModel.findByIdAndUpdate(id, { $inc: { quantity: 1 } })
        } else {
            if (req.body?.quantity == false) {
                cart = await cartModel.findByIdAndUpdate(id, { $inc: { quantity: -1 } }, { returnDocument: 'after' })
                if (cart && cart?.quantity <= 0) {
                    await cartModel.findByIdAndDelete(cart._id)
                    return res.status(200).json({ success: true, message: 'cart delete successfully' })
                }
            }
        }

        return res.status(200).json({ success: true, message: 'cart update successfully' })


    } catch (error) {
        return next(error)
    }
}

exports.Deletecart = async (req, res, next) => {
    try {
        const id = req.params.id

        if (!mongoose.isValidObjectId(id)) {
            return next(CustomeError(409, "cart id is invalid"))
        }

        const cart = await cartModel.findByIdAndDelete(id)
        if (cart) {
            return res.status(200).json({ success: true, message: "cart delete successfully" })
        } else {
            return next(CustomeError(404, 'cart not found'))
        }
    } catch (error) {
        return next(error)
    }
}