const mongoose  = require("mongoose")
const { CustomeError } = require("../../../middleware/globelError")
const wishlistModel = require("../../../model/wishlist.model")
const { GetWishlistpipiline } = require("../../../helper/aggretionpipeline")


exports.AddWishlist = async (req, res, next) => {
    try {
        if (!req.body?.productId) {
            return next(CustomeError(422, "product id is require"))
        }

        if(!mongoose.isValidObjectId(req.body.productId)){
            return next(CustomeError(422, "product id is invalid"))
        }

        let wishlist = await wishlistModel.findOne({ userId: req.user._id, productId: req.body.productId })

        if (wishlist) {
            await wishlistModel.findByIdAndDelete(wishlist._id)
            return res.status(200).json({ success: true, message: 'product removie from wishlisat' })
        }
        await wishlistModel.create({ ...req.body, userId: req.user._id })
        return res.status(200).json({ success: true, message: 'product add from wishlisat' })

    } catch (error) {
        return next(error)
    }
}

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