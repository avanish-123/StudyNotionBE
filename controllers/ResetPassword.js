// reset password, reset password token
const crypto = require('crypto');
const User = require("../models/User");
const bcrypt = require('bcrypt')
const { mailSender } = require('../utils/mailSender');
const ResetPasswordToken = require('../models/ResetPasswordToken');
const { passwordUpdated } = require('../mail/templates/passwordUpdate');

exports.resetPasswordtoken = async(req,res)=>{
    try {
        const {email} = req.body;
        //check account exist or not on this email
        let checkUser = await User.findOne({email});
        if(!checkUser){
            return res.status(400).json({
                success: false,
                message: 'No user found with this email',
            })
        };
        //if user found with above mail
        //generate token 
        const token = crypto.randomBytes(10).toString('hex');
        // using 3000 port number for frontend 
        const url = `http:localhost:3000/update-password/${token}`;
        //save in database
        await ResetPasswordToken.create({email, token});
        //send email to user
        await mailSender(email, 'Password reset', `reset password url <a target="_blank" target href="${url}">Link</a><br/> only valid for 5 minutes`);
        //return response
        return res.status(200).json({
            success: true,
            message:"please check your email for reset url"
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:"Inernal server error",
            error: error.message
        })
        
    }
}


exports.resetPassword = async(req,res)=>{
    try {
        const {newPassword, confirmNewPassword} = req.body;
        const {token} = req.query;
        //check if both fields doesn't match
        if(newPassword !== confirmNewPassword){
            return res.status(401).json({
                success: false,
                message:'both fields should be same'
            })
        }
        //fetch token
        const data = await ResetPasswordToken.findOne({token}).sort({createdAt: -1}).limit(1)
        //if token doesn't exist
        if(!data){
            return res.status(401).json({
                success: false,
                message: 'Token is expired'
            }) 
        }
        //if token exist
        const hashedPassword = await bcrypt.hash(newPassword,10)
        let email = data.email;
        const user = await User.findOneAndUpdate({email}, {password: hashedPassword})
        await mailSender(email, 'Password Changed', passwordUpdated(email, `${user.firstName} ${user.lastName}`));
        await ResetPasswordToken.deleteMany({email})
        return res.status(200).json({
            success: true,
            message:"Password changed successfully"
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Inernal server error'
        })
        
    }
}
