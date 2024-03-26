const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
        trim: true,
    },
    courseDescription:{
        type:String,
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    whatYouWillLearn:{
        type: String,
    },
    courseContent:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section'
    }],
    ratingAndReviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RatingAndReviews'
    }],
    price:{
        type: Number,
    },
    thumbnail:{
        type: String,
    },
    category:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    tags:{
        type:String
    },
    studentEnrolled:[{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }],
    instructions: {
        type: String
    },
    status: {
        type: String,
        enum: ['Draft', 'Published']
    }

})
module.exports = mongoose.model('Course', courseSchema)