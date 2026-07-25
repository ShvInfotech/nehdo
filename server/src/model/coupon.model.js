const mongoose = require('mongoose')

const couponSchema = mongoose.Schema({
    couponCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    discountType: {
        type: String,
        enum: ['Percentage', 'CartDiscount', 'ProductDiscount', "Shipping"],
        trim: true,
        default: 'Percentage'
    },
    discountValue: {
        type: Number,
        required: true,
    },
    minimumPurchase: {
        type: Number,
        default: 0
    },
    maximumDiscount: {
        type: Number,
        default: 0
    },
    maxLimit: {
        type: Number,
        default: 0
    },
    limitUse: {
        type: Number,
        default: 0
    },
    maxusecoupone: {
        type: Number,
        default: 1
    },
    StartDate: {
        type: Date,
        default: null
    },
    EndDate: {
        type: Date,
        default: null
    },
    apply: {
        type: String,
        enum: ['allProduct', 'specificProduct', 'specificCategory']
    },
    productSku: {
        type: [String],
        default: []
    },
    excludeSku: {
        type: [String],
        default: []
    },
    couponUser: {
        type: String,
        enum: ['AllUser', 'FirstOrder', 'specificCustomer']
    },
    applayCustomer: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'expired'],
        default: 'active'
    }


},
    {
        versionKey: false,
        timestamps: true
    }
)


module.exports = mongoose.model('coupons', couponSchema)



