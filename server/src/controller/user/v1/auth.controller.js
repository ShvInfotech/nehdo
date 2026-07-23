const { CustomeError } = require("../../../middleware/globelError");
const { generateJwtToken, generatehashToken } = require("../../../middleware/jwtToken");
const userModel = require('../../../model/user.model')
const bcrypt = require('bcrypt')
const validator = require("validator");
const firebaseadmin = require("../../../config/firebase");
const { getAuth } = require("firebase-admin/auth");
const  mongoose = require("mongoose");
const { DeleteImage } = require("../../../helper/helper");


exports.UserRegister = async (req, res, next) => {
    try {
        const { name, email, password } = req.body || {}

        if (!name) {
            return next(CustomeError(422, "name is required"))
        }

        if (!email) {
            return next(CustomeError(422, "email is required"))
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email"
            });
        }


        if (!password) {
            return next(CustomeError(422, "password is required"))
        }


        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one symbol."
            });
        }

        const hashpassword = await bcrypt.hash(password, 10)
        let user = await userModel.create({ ...req.body, password: hashpassword, })

        const accessToken = generateJwtToken(user)
        const hashToken = generatehashToken(accessToken)

        user = await userModel.findByIdAndUpdate(user._id, { $addToSet: { accessToken: hashToken, deviceToken: req.body.deviceToken } }).select(['name', 'email', 'phone', 'address', 'role', 'profile'])
        return res.status(200).json({ success: true, message: 'user registered  successfully', user, accesstoken: accessToken })
    } catch (error) {

        return next(error)
    }
}


exports.UserLogin = async (req, res, next) => {
    try {
        
        const { email, password } = req.body || {}


        if (!email) {
            return next(CustomeError(422, "email is required"))
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email"
            });
        }
        
        if (!password) {
            return next(CustomeError(422, "password is required"))
        }
        
       
        let user = await userModel.findOne({ email: email })
        if (!user) {
            return next(CustomeError(404, "user not found"))
        }
        
        const hashpassword = await bcrypt.compare(password, user.password)

        if (!hashpassword) {
            return next(CustomeError(409, 'wrong password'))
        }

        const accessToken = generateJwtToken(user)
        const hashToken = generatehashToken(accessToken)

        user = await userModel.findByIdAndUpdate(user._id, { $addToSet: { accessToken: hashToken, deviceToken: req.body.deviceToken } }).select(['name', 'email', 'phone', 'address', 'role', 'profile'])
        return res.status(200).json({ success: true, message: 'user login successfully', user, accesstoken: accessToken })
    } catch (error) {
        return next(error)
    }
}



exports.GoogelLogin = async (req, res, next) => {
    try {

        if (!req.body?.GoogleIdToken) {
            return next(CustomeError(422, "GoogleIdToken is required"))
        }

        const decoded = await getAuth(firebaseadmin).verifyIdToken(req.body.GoogleIdToken);
        if (!decoded) {
            return next(409, "invalid user")
        }

        let user = await userModel.findOne({ email: decoded.email })

        if (!user) {
            user = await userModel.create({ name: decoded.name, email: decoded.email, profile: decoded.picture, provider: ['google'], googleId: decoded.sub })
        }

        if (user && (user.provider.includes("local") || user.provider.includes("facebook"))) {
            user = await userModel.findByIdAndUpdate(user._id, { $addToSet: { provider: 'google', googleId: decoded.sub } })
        }

        const accessToken = generateJwtToken(user)
        const hashToken = generatehashToken(accessToken)

        user = await userModel.findByIdAndUpdate(user._id, { $addToSet: { accessToken: hashToken, deviceToken: req.body.deviceToken } }).select(['name', 'email', 'phone', 'address', 'role', 'profile'])
        return res.status(200).json({ success: true, message: 'user login successfully', user, accesstoken: accessToken })
    } catch (error) {
        return next(error)
    }
}



exports.UpdateUserProfile = async (req, res, next) => {
    try {
        const id = req.params.id

        if (!mongoose.isValidObjectId(id)) {
            return next(CustomeError(422, "User id Invalid"))
        }
        let user = await userModel.findById(id)

        if (!user) {
            return next(CustomeError(404, "user not found"))
        }

        let profile = user.profile
        const UpdateData = {
            ...req.body,

        }
        if (req.file) {
            if (profile !== "") {
                DeleteImage(profile)
            }

            UpdateData.profile = `/uploads/${req.file.fieldname}/${req.file.filename}`
        }


        if (req.body?.address) {
            const address = user.address
            address.push(req.body.address.trim())
            UpdateData.address = address
        }

        if (req.body?.addressdata) {
            const updateAddress = JSON.parse(req.body.addressdata)
            let setaddress = user.address[updateAddress.index] = updateAddress.value
            UpdateData.address = user.address
        }
        user = await userModel.findByIdAndUpdate(id, UpdateData, { returnDocument: 'after' }).select(['name', 'email', 'phone', 'address', 'role', 'profile'])
        return res.status(200).json({ success: true, message: "user profile update successfully", user })
    } catch (error) {
        return next(error)
    }
}

















