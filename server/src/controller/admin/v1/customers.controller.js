const sendEmail = require("../../../config/nodemailer.confing")
const { GetCustomersAdmin } = require("../../../helper/aggretionpipeline")
const { AccountBlockedMail, DynamicMail } = require("../../../helper/emailTemplate")
const userModel = require("../../../model/user.model")
const bcrypt = require('bcrypt')


exports.GetCustomers = async (req, res, next) => {
    try {
        const customers = await userModel.aggregate(GetCustomersAdmin())

        return res.status(200).json({ success: true, message: "Get customers", customers })
    } catch (error) {
        return next(error)
    }
}


exports.UpdateCustomer = async (req, res, next) => {
    try {
        const id = req.params.id

        const payload = {}
        if (req.body?.status) {
            payload.status = req.body.status
        }

       

        if (req.body?.password) {
            const hashpassword = await bcrypt.hash(req.body?.password, 10)
            payload.password = hashpassword

        }

        const updateData = {
            $set: payload,
        };

        if (req.body?.password) {
            updateData.$addToSet = {
                provider: 'local',
            };
        }

        const user = await userModel.findByIdAndUpdate(id, updateData,{returnDocument:'after'})
        if (!user) {
            return next(CustomeError(404, 'user not found'))
        }

         if(req.body?.status == "block"){
           await sendEmail(AccountBlockedMail(user.email,user.name))
           
        }

        return res.status(200).json({ success: true, message: 'Customer Updated' })
    } catch (error) {
        return next(error)
    }
}



exports.sendMailCustomer = async(req,res,next)=>{
    try {
        console.log(req.body)
        sendEmail(DynamicMail({...req.body}))
        return res.status(200).json({success:true,message:'mail sent!!!'})
    } catch (error) {
        return next(error)
    }
}