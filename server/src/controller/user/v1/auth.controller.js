const { CustomeError } = require("../../../middleware/globelError");
const { generateJwtToken, generatehashToken } = require("../../../middleware/jwtToken");
const userModel = require('../../../model/user.model')
const bcrypt = require('bcrypt')
const validator = require("validator");
const firebaseadmin = require("../../../config/firebase");
const { getAuth } = require("firebase-admin/auth");
const mongoose = require("mongoose");
const { DeleteImage } = require("../../../helper/helper");
const jwt = require('jsonwebtoken');
const sendEmail = require("../../../config/nodemailer.confing");
const { ForgetPasswordMail } = require("../../../helper/emailTemplate");
const addressModel = require("../../../model/address.model");

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
        if (user.profile !== "") {
            user.profile = `http://${process.env.HOST}:${process.env.PORT}${user.profile}`;
        }

        const address = await addressModel.find({ userId: user._id })
        const userData = user.toObject();
        userData.address = address;
        return res.status(200).json({ success: true, message: 'user registered  successfully', user:userData, accesstoken: accessToken })
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

        user = await userModel.findByIdAndUpdate(user._id, { $addToSet: { accessToken: hashToken, deviceToken: req.body.deviceToken } }).select(['name', 'email', 'phone', 'role', 'profile'])
        if (user.profile) {
            user.profile = `http://${process.env.HOST}:${process.env.PORT}${user.profile}`;
        }

        const address = await addressModel.find({ userId: user._id })
        const userData = user.toObject();
        userData.address = address;
        
        return res.status(200).json({ success: true, message: 'user login successfully', user: userData, accesstoken: accessToken })
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

        user = await userModel.findByIdAndUpdate(user._id, { $addToSet: { accessToken: hashToken, deviceToken: req.body.deviceToken } }).select(['name', 'email', 'phone', 'role', 'profile'])
       
   const address = await addressModel.find({ userId: user._id })
        const userData = user.toObject();
        userData.address = address;

        return res.status(200).json({ success: true, message: 'user login successfully', user:userData, accesstoken: accessToken })
    } catch (error) {
        return next(error)
    }
}



exports.UpdateUserProfile = async (req, res, next) => {
    try {
        const id = req.params.id;

        if (!mongoose.isValidObjectId(id)) {
            return next(CustomeError(422, 'User id Invalid'));
        }

        let user = await userModel.findById(id);

        if (!user) {
            return next(CustomeError(404, 'user not found'));
        }

        // 👇 add this block
        if (req.body.email && req.body.email !== user.email) {

            const existingUser = await userModel.findOne({
                email: req.body.email,
                _id: { $ne: id }
            });

            if (existingUser) {
                return next(CustomeError(409, 'Email already exists'));
            }
        }

        let profile = user.profile;

        const UpdateData = {
            ...req.body,
        };

        if (req.file) {
            if (profile !== '') {
                DeleteImage(profile);
            }

            UpdateData.profile =
                `/uploads/${req.file.fieldname}/${req.file.filename}`;
        }

        user = await userModel
            .findByIdAndUpdate(id, UpdateData, {
                returnDocument: 'after',
                runValidators: true
            })
            .select(['name', 'email', 'phone', 'role', 'profile']);

        if (user.profile !== '') {
            user.profile =
                `http://${process.env.HOST}:${process.env.PORT}${user.profile}`;
        }

        const address = await addressModel.find({ userId: user._id });

        const userData = user.toObject();
        userData.address = address;

        return res.status(200).json({
            success: true,
            message: 'user profile update successfully',
            user: userData
        });

    } catch (error) {
        return next(error);
    }
};

exports.ForgotPassword = async (req, res, next) => {
    try {
        if (!req.body?.email) {
            return next(CustomeError(422, "email is required"))
        }

        const user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            return next(CustomeError(404, "user not found"))
        }

        let token = jwt.sign({ userId: user._id }, process.env.PASSWORD_JWT_SECRET, { expiresIn: "10m" })
        token = `http://${process.env.HOST}:${process.env.PORT}/user/api/v1/auth/reset-password/${token}`
        sendEmail(ForgetPasswordMail(user.email, user.name, token))


        return res.status(200).json({ success: true, message: "reset pssword link send your register email" })

    } catch (error) {
        return next(error)
    }
}

exports.ResetPasswordpage = async (req, res, next) => {
    try {
        const token = req.params.token
        res.render('reset-password', { token, message: "", type: "" })
    } catch (error) {
        return next(error)
    }
}


exports.ResetPassword = async (req, res, next) => {

    try {

        const token = req.params.token;
        const { password } = req.body;

        const decoded = jwt.verify(token, process.env.PASSWORD_JWT_SECRET);

        const userId = decoded.userId;

        // 2. hash password
        const hashPassword = await bcrypt.hash(password, 10);

        await userModel.findByIdAndUpdate(userId, { password: hashPassword, accessToken: [] });
        return res.render("reset-password", {
            token,
            message: "Password updated successfully",
            type: "success"
        });



    } catch (error) {
        console.log(error)
        if (error.name === "TokenExpiredError") {
            return res.render("reset-password", {
                token: null,
                message: "Your reset password link has expired. Please request a new one.",
                type: "expired"
            });
        }

        // ❌ INVALID TOKEN
        if (error.name === "JsonWebTokenError") {
            return res.render("reset-password", {
                token: null,
                message: "Invalid reset password link.",
                type: "error"
            });
        }
        return next(error);
    }
};


















