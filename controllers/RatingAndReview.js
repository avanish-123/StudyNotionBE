const Course = require("../models/Course");
const RatingAndReviews = require("../models/RatingAndReviews");
const mongoose = require("mongoose");
exports.rateAndReviewCourse = async (req, res) => {
  try {
    const { courseId, rating, review } = req.body;
    const userId = req.user.id;
    let courseDetails = await Course.findById(courseId);
    //check user enrolled or not
    if (!courseDetails.studentEnrolled.includes(userId)) {
      return res.status(400).json({
        success: false,
        message:
          "You are not enrolled in this course so you can't rate and review",
      });
    }
    //check weather user already rated or not
    const checkRatingAndReview = await RatingAndReviews.find({
      userId: userId,
      courseId: courseId,
    });
    if (checkRatingAndReview.length !== 0) {
      return res.status(400).json({
        success: "You have already rated and reviewed the course",
      });
    }
    //add rating and review
    const ratingAndReview = await RatingAndReviews.create({
      courseId,
      userId,
      rating,
      review,
    });
    //update the course collection
    await Course.findByIdAndUpdate(courseId, {
      $push: { ratingAndReviews: ratingAndReview._id },
    });

    return res.status(200).json({
      success: true,
      message: "rating and review added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
//deleteRatingReview
exports.deleteRatingAndReview = async (req, res) => {
  try {
    const { ratingAndReviewId } = req.body;
    // find the review and get course id
    const ratingAndReview = await RatingAndReviews.findById(ratingAndReviewId);
    let courseId = ratingAndReview.courseId;
    //delete from rating and review collection
    await RatingAndReviews.findByIdAndDelete(ratingAndReviewId);
    //delete from course collection
    await Course.findByIdAndUpdate(courseId, {
      $pull: { ratingAndReviews: ratingAndReviewId },
    });
    res.status(200).json({
      success: true,
      message: "RAting and review deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//updateratingAndReview
exports.updateRatingAndReview = async (req, res) => {
  try {
    const { ratingAndReviewId, rating, review } = req.body;
    //update the data
    const checkUser = req.user.id;
    if (checkUser.userId.toString() !== req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You are not authorize to delete this review",
      });
    }
    await RatingAndReviews.findByIdAndUpdate(ratingAndReviewId, {
      rating: rating,
      review: review,
    });
    return res.status(200).json({
      success: true,
      message: "Rating and review updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//getAverageRating
exports.getAverageRating = async (req, res) => {
  try {
    let { courseId } = req.body;
    courseId = new mongoose.Types.ObjectId(courseId);
    const averageRating = await RatingAndReviews.aggregate([
      { $match: { courseId: courseId } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ]);
    return res.status(200).json({
      success: true,
      data: averageRating[0].averageRating,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
      error: error.message,
    });
  }
};

//getAllRatingAndReview
exports.getAllRatingAndReview = async (req, res) => {
  try {
    const { courseId } = req.body;
    const allRating = await RatingAndReviews.find({
      courseId: courseId,
    })
      .populate([
        { path: "userId", select: "firstName lastName accountType" },
        {
          path: "courseId",
          select: "courseName courseDescription instructor",
          populate: { path: "instructor" },
        },
      ])
      .exec();
    res.status(200).json({
      success: true,
      data: allRating,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
