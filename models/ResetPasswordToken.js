const mongoose = require('mongoose');
const resetPasswordToken = new mongoose.Schema({
    email:{
        type: String,
    },
    token:{
        type:String
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        expires: 5*60
    }
})
module.exports = mongoose.model('ResetPasswordToken', resetPasswordToken)
