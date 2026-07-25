const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products',
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    size:{
        type:String,
        required:true,
    },
    color:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        min:1,
        required:true,
        default:1,
    }

},
{
    versionKey: false,
    timestamps: true
}
)


module.exports = mongoose.model('carts',cartSchema)