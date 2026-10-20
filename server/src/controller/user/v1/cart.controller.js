const mongoose = require("mongoose")
const cartModel = require("../../../model/cart.model")
const { CustomeError } = require("../../../middleware/globelError")
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
        $inc: { quantity: Number(req.body.quantity || 1) }
      },
      {
        returnDocument: 'after'
      }
    );


    if (!cart) {
      cart = await cartModel.create({ ...req.body, userId: req.user._id });
    }

    return res.status(200).json({ success: true, message: 'product add to cart', cart });

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

    if (quantity <= 0) {

      await cartModel.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: 'cart delete successfully'
      });
    }


    cart = await cartModel.findByIdAndUpdate(id, { quantity }, { returnDocument: "after" }
    );

    return res.status(200).json({ success: true, message: 'cart update successfully', cart });
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

exports.SyncCart = async (req, res, next) => {
  try {
    const items = req.body?.items;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(200).json({ success: true, message: "No items to sync" });
    }

    for (const item of items) {
      if (!item.productId || !mongoose.isValidObjectId(item.productId)) continue;
      if (!item.size || !item.color) continue;
      const qty = Math.max(1, Number(item.quantity || 1));

      // Check if product with size + color already exists in user's cart
      let cart = await cartModel.findOneAndUpdate(
        {
          userId: req.user._id,
          productId: item.productId,
          size: item.size,
          color: item.color
        },
        {
          $inc: { quantity: qty }
        },
        {
          returnDocument: 'after'
        }
      );

      if (!cart) {
        await cartModel.create({
          userId: req.user._id,
          productId: item.productId,
          size: item.size,
          color: item.color,
          quantity: qty
        });
      }
    }

    const carts = await cartModel.aggregate(GetCartPipeline(req.user._id));
    return res.status(200).json({
      success: true,
      message: "Cart synced successfully",
      carts
    });
  } catch (error) {
    return next(error);
  }
};