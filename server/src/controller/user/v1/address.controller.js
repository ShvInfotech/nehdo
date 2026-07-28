const { CustomeError } = require("../../../middleware/globelError")
const addressModel = require("../../../model/address.model")


exports.AddAddress = async (req, res, next) => {
    try {
        if (!req.body?.addressline) {
            return next(CustomeError(422, 'addressline is required'))
        }

        if (!req.body?.landmark) {
            return next(CustomeError(422, 'landmark is required'))
        }

        if (!req.body?.city) {
            return next(CustomeError(422, 'city is required'))
        }

        if (!req.body?.state) {
            return next(CustomeError(422, 'state is required'))
        }

        if (!req.body?.postalCode) {
            return next(CustomeError(422, 'postalCode is required'))
        }

        if (req.body.defaultaddress) {
            await addressModel.updateMany({ userId: req.user._id }, { defaultaddress: false })
        }

        const address = await addressModel.create({ ...req.body, userId: req.user._id })

        return res.status(200).json({ success: true, message: 'address added', address })
    } catch (error) {
        return next(error)
    }
}

exports.GetAddress = async(req,res,next)=>{
    try {
        const address = await addressModel.find({userId:req.user._id})

        return res.status(200).json({success:true,message:'get addresses',address})
    } catch (error) {
        return next(error)
    }
}

exports.UpdateAddress = async (req, res, next) => {
    try {

        const id = req.params.id
        if (req.body.defaultaddress) {
            await addressModel.updateMany({ userId: req.user._id }, { defaultaddress: false })
        }
        const address = await addressModel.findByIdAndUpdate(id, { ...req.body }, { returnDocument: "after" })
        return res.status(200).json({ success: true, message: 'address update successfully', address })

    } catch (error) {
        return next(error)
    }
}

exports.DeleteAddress = async (req, res, next) => {
    try {

        const id = req.params.id

        let address = await addressModel.findByIdAndDelete(id)
        if (address?.defaultaddress) {
            const anotherAddress = await addressModel.findOne({
                userId: req.user._id,
            });

            if (anotherAddress) {
                await addressModel.findByIdAndUpdate(anotherAddress._id, {
                    defaultaddress: true,
                });
            }
        }
        return res.status(200).json({ success: true, message: 'address delete successfully',address })

    } catch (error) {
        return next(error)
    }
}