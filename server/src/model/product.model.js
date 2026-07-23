const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    // table connection filed
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
        required: true
    },
    subcategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subcategories',
        required: true,
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brands',
        required: true
    },

    // table  filed name
    name: {
        type: String,
        required: true,
        trim: true
    },
    sku: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    barcode: {
        type: String,
        unique: true,
        sparse: true,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 100
    },
    salePrice: {
        type: Number,
        required: true,
        min: 100
    },
    itemCost: {
        type: Number,
        default: 0
    },
    tags: {
        type: [String],
        default: []
    },
    productImage: {
        type: [String],
        default: []
    },
    shortDescription: {
        type: String,
        trim: true,
        default: ''
    },
    longDescription: {
        type: String,
        trim: true,
        default: ''
    },
    status: {
        type: String,
        enum: ['Active', 'Draft', 'Archived'],
        default: 'Active'
    },
    visibility: {
        type: String,
        enum: ['visible', 'hidden'],
        default: 'visible'
    },
    flags: {
        type: [String],
        enum: ['Featured', 'New Arrival', 'Trending'],
        default: []
    },


    // seo
    slug: {
        type: String,
        required:true,
        unique: true,
    },
    metaTitle: {
        type: String,
        default: ''
    },
    metaDescription: {
        type: String,
        default: ''
    }


},
    {
        versionKey: false,
        timestamps: true
    }
)


module.exports = mongoose.model('products', productSchema)
