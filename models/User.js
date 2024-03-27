const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim: true
    },
    lastName:{
        type:String,
        required:true,
        trim: true
    },
    email:{
        type:String,
        required:true,
        trim: true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        enum:['Admin', 'Instructor', 'Student'],
        required:true,
    },
    additionalDetails:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Profile'
    },
    image:{
        type: String,
        required:true
    },
    courses:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ],
    courseProgress:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CourseProgress'
        }
    ],
    active:{
        type: Boolean,
        default: true
    },
    approved:{
        type: Boolean,
        default: true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    updatedAt:{
        type: Date,
        default: Date.now()
    }
})
module.exports = mongoose.model('User', UserSchema)