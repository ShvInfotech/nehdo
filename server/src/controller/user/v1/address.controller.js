const { CustomeError } = require("../../../middleware/globelError")
const addressModel = require("../../../model/address.model")


exports.AddAddress= async(req,res,next)=>{
    try {
        if(!req.body?.addressline){
            return next(CustomeError(422,'addressline is required'))
        }

        if(!req.body?.landmark){
            return next(CustomeError(422,'landmark is required'))
        }

        if(!req.body?.city){
            return next(CustomeError(422,'city is required'))
        }

        if(!req.body?.state){
            return next(CustomeError(422,'state is required'))
        }

        if(!req.body?.postalCode){
            return next(CustomeError(422,'postalCode is required'))
        }

        const address = await addressModel.create({...req.body,userId:req.user._id})
        
        return res.status(200).json({success:true,message:'address added'})
    } catch (error) {
        return next(error)
    }
}