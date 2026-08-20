const mongoose = require('mongoose')
const { trim } = require('validator')

const ratingSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    orderId:{
         type: mongoose.Schema.Types.ObjectId,
        ref: 'orders'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    },
    rating: {
        type: Number,
        max: 5,
        min: 0,
        required: true
    },
    review: {
        type: String,
        trim: true,
        default: ''
    },
    status:{
        type:String,
        enum:["pending","approved",'rejected'],
        default:'pending'
    },
    reply:{
        type:String,
        trim:true,
        default:''
    }
},
    {
        versionKey: false,
        timestamps: true
    }
)


module.exports = mongoose.model('ratings', ratingSchema)