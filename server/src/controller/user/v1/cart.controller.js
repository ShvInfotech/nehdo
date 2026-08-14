const mongoose = require("mongoose")
const { CustomeError } = require("../../../middleware/globelError")
const cartModel = require("../../../model/cart.model")
const { GetCartPipeline } = require("../../../helper/aggretionpipeline")


exports.AddCart = async (req, res, next) => {
  try {

    if (!req.body?.productId) {
      return next(CustomeError(422, 'product id is required'));
    }

    if (!mongoose.isValidObjectId(req.body?.productId)) {
      return next(CustomeError(422, 'product id is invalid'));
    }

    if (!req.body?.size) {
      return next(CustomeError(422, 'size is required'));
    }

    if (!req.body?.color) {
      return next(CustomeError(422, 'color is required'));
    }

    if (!req.body?.quantity) {
      return next(CustomeError(422, 'quantity is required'));
    }

    // 🔥 size + color sathe check
    let cart = await cartModel.findOneAndUpdate(
      {
        userId: req.user._id,
        productId: req.body.productId,
        size: req.body.size,
        color: req.body.color
      },
      {
        $inc: {
          quantity: Number(req.body.quantity || 1)
        }
      },
      {
        new: true
      }
    );

    // same variant na hoy to navi row create karo
    if (!cart) {

      cart = await cartModel.create({
        ...req.body,
        userId: req.user._id
      });
    }

    return res.status(200).json({
      success: true,
      message: 'product add to cart',
      cart
    });

  } catch (error) {
    return next(error);
  }
};


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

    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
      return next(CustomeError(409, 'cart id is invalid'));
    }

    if (req.body?.quantity == null) {
      return next(CustomeError(422, 'quantity is required'));
    }

    const quantity = Number(req.body.quantity);

    if (isNaN(quantity)) {
      return next(CustomeError(422, 'quantity is invalid'));
    }

    let cart = await cartModel.findById(id);

    if (!cart) {
      return next(CustomeError(404, 'cart not found'));
    }

    // quantity 0 hoy to delete
    if (quantity <= 0) {

      await cartModel.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: 'cart delete successfully'
      });
    }

    // direct quantity set karo
    cart = await cartModel.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'cart update successfully',
      cart
    });

  } catch (error) {
    return next(error);
  }
};

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