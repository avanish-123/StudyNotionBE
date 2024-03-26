const Course = require('../models/Course');
const RatingAndReviews = require('../models/RatingAndReviews');
exports.rateAndReviewCourse = async(req,res)=>{
    try {
        const {courseId, userId, rating, review} = req.body
        let courseDetails = await Course.findById(courseId);
        if(!courseDetails.studentEnrolled.includes(userId)){
            return res.status(400).json({
                success: false,
                message: "You are not enrolled in this course so you can't rate and review",
            }) 
        }
        //add rating and review
        const ratingAndReview = await RatingAndReviews.create({courseId, userId, rating, review});
        //update the course collection
        await Course.findByIdAndUpdate(courseId, {$push: {ratingAndReviews: ratingAndReview._id}})

        return res.status(200).json({
            success: true,
            message: 'rating and review added successfully'
        })
        

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
        
    }
}