const mongoose = require('mongoose');
const ratingAndReviews = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    rating:{
        type:Number,
        required: true,
        enum:[1,2,3,4,5]
    },
    review:{
        type: String,
        required: true,
        trim: true
    }
})
module.exports = mongoose.model('RatingAndReviews', ratingAndReviews)