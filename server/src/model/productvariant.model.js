const mongoose = require("mongoose")

const variantSchema = mongoose.Schema({
    // table connection filed
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required:true
    },
    size: {
        type: [String],
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
        default: []
    },
    colorOptions: {
        type: [String],
        default: []
    },
    material: {
        type: String,
        default:''
    },
    variant: {
        type: [{
             name: {type:String}, price: {type:Number}, stock: {type:Number}, sku: {type:String}}],
        default:[]
    }
},
    {

        versionKey: false
    }
)

module.exports = mongoose.model('productvariants',variantSchema)
