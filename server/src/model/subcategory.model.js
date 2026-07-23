const mongoose = require('mongoose')


const subcategorySchema = mongoose.Schema({
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'categories',
        required:true,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        default: '',
        trim: true

    },
    logo:{
        type:String,
        default:''
    },
    description: {
        type: String,
        default: '',
        trim: true

    },
    displayOrder: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },

    homepageDisplay: {
        type: Boolean,
        default: false
    },

    navbarmenuDisplay: {
        type: Boolean,
        default: false
    }

},
    {
        versionKey: false,
        timestamps: true
    })

    module.exports = mongoose.model('subcategories', subcategorySchema)