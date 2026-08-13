const mongoose  = require("mongoose")
const { CustomeError } = require("../../../middleware/globelError")
const wishlistModel = require("../../../model/wishlist.model")
const { GetWishlistpipiline } = require("../../../helper/aggretionpipeline")


exports.AddWishlist = async (req, res, next) => {
  try {

    if (!req.body?.productId) {
      return next(CustomeError(422, 'product id is require'));
    }

    if (!mongoose.isValidObjectId(req.body.productId)) {
      return next(CustomeError(422, 'product id is invalid'));
    }

    // check existing wishlist
    let wishlist = await wishlistModel.findOne({
      userId: req.user._id,
      productId: req.body.productId
    });

    // remove if already exists
    if (wishlist) {

      await wishlistModel.findByIdAndDelete(wishlist._id);

      return res.status(200).json({
        success: true,
        action: 'removed',
        message: 'product removed from wishlist',
        wishlistId: wishlist._id
      });
    }

    // create new wishlist
    wishlist = await wishlistModel.create({
      productId: req.body.productId,
      userId: req.user._id
    });

    return res.status(200).json({
      success: true,
      action: 'added',
      message: 'product added to wishlist',
      wishlist
    });

  } catch (error) {
    return next(error);
  }
};

exports.GetWishlist = async(req,res,next)=>{
    try {
        
        const wishlists = await wishlistModel.aggregate(GetWishlistpipiline(req.user._id))

        return res.status(200).json({success:true,message:"get wishlists",wishlists})
    } catch (error) {
        return next(error)
    }
}

exports.DeleteWishlist = async(req,res,next)=>{
    try {
        const id = req.params.id
        const wishlist = await wishlistModel.findByIdAndDelete(id) 
        if(wishlist){
            return res.status(200).json({success:true,message:"product remove from wishlist"})
        }else{
            return next(CustomeError(404,'wishlist not found'))
        }
    } catch (error) {
        return next(error)
    }
}