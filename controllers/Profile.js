const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/uploadFileToCloudinary");
require('dotenv').config()

exports.updateProfile = async (req, res) => {
  try {
    const { gender, dateOfBirth, about, contactNo } = req.body;
    //retrieve userId from auth middleware
    let userId = req.user.id;
    //fetch the user based on userId
    const user = await User.findById(userId);
    // take the additional profile id of the user
    const additionalDetailsId = user.additionalDetails;
    //update the details in profile collection based on id
    await Profile.findByIdAndUpdate(additionalDetailsId, {
      gender,
      dateOfBirth,
      about,
      contactNo,
    });
    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateProfilePicture = async (req, res) => {
  try {
    const profilePic = req.files.profilepic;
    if (!profilePic) {
      return res.status(400).json({
        success: false,
        message: "Please add the image file",
      });
    }
    const uplaodImage = await uploadImageToCloudinary(
      profilePic,
      process.env.CLOUDINARY_FOLDER
    );
    await User.findByIdAndUpdate(req.user.id, {image: uplaodImage.secure_url});
    return res.status(200).json({
        success:true,
        message: 'profile picture updated Successfully'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Inernal server error",
      error: error.message,
    });
  }
};

//delete account
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    // deleteProfile
    // fetch details
    const details = await User.findById(userId);
    //delete additionalData from profile collection
    await Profile.findByIdAndDelete(details.additionalDetails);
    //delete user from user collection
    await User.findByIdAndDelete(userId);
    return res.status(200).json({
      success: true,
      message: "Account deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//get user's all details
exports.getUserAllDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    //check user present or not in databse with about id
    const checkUser = await User.findById(userId)
      .populate("additionalDetails")
      .populate("courses")
      .exec();
    if (!checkUser) {
      return res.status(400).json({
        success: false,
        message: "No account found with this user id",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: checkUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
