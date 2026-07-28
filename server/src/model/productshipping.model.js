const mongoose = require("mongoose")

const shippingSchema = mongoose.Schema({
    // table connection filed
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required:true
    },
    shipping: {
        type: Boolean,
        default: true
    },
    weight: {
        type: Number,
        min:0.1,
        default: 0.1
    },
    dimensions: {
        type: {
            length: { type: Number, default: 0 },
            width: { type: Number, default: 0 },
            height: { type: Number, default: 0 }
        },
         _id: false
    },
    HSCode: {
        type: String,
        default: ''
    }
},
    {

        versionKey: false
    }
)

module.exports = mongoose.model('productshippings',shippingSchema)
