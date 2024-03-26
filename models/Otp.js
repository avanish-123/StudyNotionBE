const mongoose = require('mongoose');
const { mailSender } = require('../utils/mailSender');
const otpTemplate = require('../mail/templates/emailVerificationTemplate');
const otpSchema = new mongoose.Schema({
    email:{
        type: String,
        trim: true,
    },
    otp:{
        type: Number,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        expires: 5*60
    }
});
//functon to send verification mail
async function sendVerificationEmail(email, otp){
    try {
        const mailResponse = await mailSender(email, "verification email from studyNotion", otpTemplate(otp));
    } catch (error) {
        console.log(error);
        console.log('error while sending verification email');
        throw error
    }
}

otpSchema.pre('save', async function(next){
    await sendVerificationEmail(this.email, this.otp)
    next();
})


module.exports = mongoose.model('OTP', otpSchema);
