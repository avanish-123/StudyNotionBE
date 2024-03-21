//login, signup, sendOTP, chnagePassword controllers
require('dotenv').config();
const otpGenarator = require("otp-generator");
const bcrypt = require('bcrypt')
const User = require("../models/User");
const OTP = require("../models/otp");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const { mailSender } = require('../utils/mailSender');

//sendOTP
exports.sendOTP = async (req, res) => {
  try {
    //fetch email from request body
    const { email } = req.body;

    //check if user already present
    const userExist = await User.findOne({ email });
    //if user exists return response
    if (userExist) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }
    // if user does not exist
    //generate OTP
    let options = {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    };
    var otp = otpGenarator.generate(6, options);

    //check unique otp or not
    let alreadyExist = await OTP.findOne({ otp: otp });
    while (alreadyExist) {
      otp = otpGenarator(6, options);
      alreadyExist = await OTP.findOne({ otp: otp });
    }

    //create otp entry in database
    const otpBody = await OTP.create({ otp, email });
    return res.status(200).send({
      success: true,
      otp,
      message: "otp created and saved successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Internal server error",
      error: `otp error ${error.message}`,
    });
  }
};


//signup controller
exports.signUp = async(req,res)=>{
    try {
        // fetch data from request body
        const {firstName, lastName, email, password, confirmPassword, accountType, otp, contactNumber} = req.body;
        if(!firstName || !lastName || !email|| !password || !confirmPassword || !otp){
          return res.status(403).json({
            success: false,
            message: "Please fill all the mandatory fields"

          })
        }
        // chekck password and confirm password are same or not
        if(password !== confirmPassword){
          return res.status(400).json({
            success: false,
            message:"password and confirm password should be same"
          })
        }
        //check user already exist or not
        const userExist = await User.findOne({email});
        if(userExist){
          return res.status(400).json({
            success:false,
            message: 'user already exist with this email address'
          })
        }

        //find most recent otp of the user
        const recentOtp = await OTP.find({email}).sort({createdAt: -1}).limit(1)
        if(recentOtp.length===0){
          return res.status(400).json({
            success: false,
            message: 'OTP not found for this email'
          })
        }
        //check otps are same or not
        if(recentOtp[0].otp!=otp){
          return res.status(400).json({
            success: false,
            message: "otp does not match please enter correct otp"
          })
        }


        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10)
        //save additional details first
        const additionalDetails = await Profile.create({
          gender: null, 
          dateOfBirth: null, 
          about: null, 
          contactNo: null
        })
        //create entry in database
        const userEntry = await User.create({
          firstName,
          lastName, 
          email,
          password: hashedPassword,
          accountType,
          additionalDetails: additionalDetails._id,
          image: `https://api.dicebear.com/8.x/initials/svg/seed=${firstName} ${lastName}`
        })

        return res.status(200).json({
          success: true,
          message: "user registered successfully"
        })
        
    } catch (error) {
      return res.status(500).json({
        success:false,
        message:'internal server error',
        error: error.message
      })
        
    }

}


//login 
exports.login = async(req,res) => {
  try {
    //fetch email and password from body
    const {email, password} = req.body
    if(!email || !password){
      return res.status(400).json({
        success: false,
        message: "please enter both email & password"
      })
    }
    //check user exist or not with fetched email id
    let checkUser = await User.findOne({email}).populate('additionalDetails').exec();
    if(!checkUser){
      return res.status(400).json({
        success: false,
        message: "user does not exist with this email"
      })
    }
    //if user exist and password does not match the hashed password
    if(!(await bcrypt.compare(password, checkUser.password))){
      return res.status(401).json({
        success: false,
        message: "Email or password is in-correct"
      })
    }
    //if password matched with hashed password
    //create token
    const payload = {
      email: checkUser.email,
      id: checkUser._id,
      accountType:checkUser.accountType
      
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '2hr'})
    checkUser = checkUser.toObject()
    checkUser.token = token
    checkUser.password = undefined
    //only for cookie
    let options = {
      expires: new Date(Date.now() + 3*24*60*60*1000),
      httpOnly: true
    }
    res.header('authorization', `Bearer ${token}`).json({
      success: true,
      token,
      checkUser,
      message:"logged in successfully"
    })
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:"Inernal server error",
      error:error.message
    })
  }  

};


//change password
exports.changePassword = async(req,res) =>{
  try {
    const { oldPassword, newPassword,confirmNewPassword } = req.body;
    const {email} = req.user;
    if(!oldPassword || !newPassword || !confirmNewPassword){
      return res.status(400).json({
        success: false,
        message: "all fields are mandatory"
      })
    }
    if(newPassword !== confirmNewPassword){
      return res.status(400).json({
        success:false,
        message:"both field of new password should match"
      })
    }
    let user = await User.findOne({email});
    if(!(await bcrypt.compare(oldPassword, user.password))){
      return res.status(400).json({
        success: false,
        message: 'Old password is incorrect'
      })
    }
    let newHashedPassword = await bcrypt.hash(newPassword, 10);
    const savedNewData = await User.findOneAndUpdate({email},{password: newHashedPassword});
    await mailSender(email,'password updated',"password updated successfully")
    return res.status(200).json({
      success: true,
      message:"Password changed successfully"
    })

    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:"Inernal server error",
      error:error.message
    })
    
  }
};