const mongoose = require('mongoose')


const brandSchema = mongoose.Schema({
    name: {
        type: String,
        unique:true,
        required: true,
        trim:true
    },
    logo:{
        type:String,
        default:''
    },
    slug:{
        type:String,
        default:'',
        trim:true

    }, 
    description:{
        type:String,
        default:'',
        trim:true

    },
    homepageDisplay:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'active'
    },
    
},
    {
        versionKey: false,
        timestamps: true
    }
)


module.exports = mongoose.model('brands', brandSchema)