const nodemailer = require('nodemailer')

const transporter  = nodemailer.createTransport({
    service:'gmail',
    port:587,
    secure:false,
    auth:{
        user:process.env.NODEMAILER_EMAIL_USER,
        pass:process.env.NODEMAILER_EMAIL_PASS
    }
})


const sendEmail = async(formet)=>{
    try {
         const res =  await transporter.sendMail(formet)
          return res
    } catch (error) {
        console.log(error)
    } 
}

module.exports = sendEmail

