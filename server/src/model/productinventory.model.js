const mongoose = require("mongoose")

const inventorySchema = mongoose.Schema({
    // table connection filed
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required:true
    },
    stock: {
        type: Number,
        default: 0
    },
    lowStock: {
        type: Number,
        default: 0
    },
    warehouseLocation: {
        type: String,
    },
    trackInventory: {
        type: Boolean,
        default: false
    },
    backorders: {
        type: Boolean,
        default: false
    }
},
    {

         versionKey: false
    }
)

module.exports = mongoose.model('productinventorys',inventorySchema)
