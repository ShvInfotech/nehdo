const { CustomeError } = require("../../../middleware/globelError")
const couponModel = require("../../../model/coupon.model")


exports.AddCoupon = async(req,res,next)=>{
    try {
        if(!req.body?.couponCode){
            return next(CustomeError(422,"couponcode is require"))
        }
        if(!req.body?.discountType){
            return next(CustomeError(422,"discount type is require"))
        }

        const coupon = await couponModel.create({...req.body})
        return res.status(200).json({success:true,message:"coupon created",coupon})
    } catch (error) {
        return next(error)
    }
}


exports.GetCoupon = async(req,res,next)=>{
    try {
        const coupons = await couponModel.find()

        return res.status(200).json({success:true,message:'get coupon',coupons})
    } catch (error) {
        return next(error)
    }
}


exports.UpdateCoupon = async (req, res, next) => {
  try {
    const coupon = await couponModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    if (!coupon) {
      return next(CustomeError(404, 'Coupon not found'));
    }

    return res.status(200).json({
      success: true,
      message: 'coupon updated',
      coupon
    });
  } catch (error) {
    return next(error);
  }
};