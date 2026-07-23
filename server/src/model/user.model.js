const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim:true

    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim:true

    },
    phone: {
        type: String,
        minlength: 10,
        maxlength: 10,
        default: null
    },
    password: {
        type: String,
        default: null
    },
    address: {
        type: [String],
        default: []
    },
    provider: {
        type: [String],
        enum: ['local', 'google'],
        default: ['local']
    },
    googleId:{
      type:String,
      default:''
    },
  
    profile:{
        type:String,
        default:''
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'block'],
        default: 'active'
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    accessToken: {
        type: [String],
        default: []
    },
    deviceToken: {
        type: [String],
        default: []
    }
},
    {
        versionKey: false,
        timestamps: true
    }
)


module.exports = mongoose.model('users', userSchema)