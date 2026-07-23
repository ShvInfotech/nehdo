const mongoose = require('mongoose')

const ratingSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products'
    },
    rating:{
        type:Number,
        max:5,
        min:0,
        required:true
    },
    note:{
        type:String,
        default:''
    }
})


module.exports = mongoose,module('ratings',ratingSchema)