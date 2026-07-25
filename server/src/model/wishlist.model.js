const mongoose = require('mongoose')

const wishlistSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    }
},
    {
        versionKey: false,
        timestamps: true
    }
)

module.exports = mongoose.model('wishlists',wishlistSchema)