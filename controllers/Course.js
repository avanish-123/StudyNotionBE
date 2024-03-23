const Course = require("../models/Course");
const Tags = require("../models/Tags");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/uploadFileToCloudinary");
// create and get all courses

exports.createCourse = async (req, res) => {
    try {
        const { courseName, courseDescription, whatYouWillLearn, price, tag } = req.body;
        const thumbnail = req.files.thumbnailImage;

        if (
            !courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            !price ||
            !tag 
            || !thumbnail
        ) {
            return res.status(400).json({
                success: false,
                message: "please fill all the required fields",
            });
        }

        //get instructor id from middleware
        const instructorUserId = req.user.id;

        //check tag is valid or not
        const tagDetails = await Tags.findById(tag);
        if (!tagDetails) {
            return res.status(400).json({
                success: false,
                message: "Please enter the correct tag",
            });
        }

        //upload image to cloudinary
        const uploadThumnail = await uploadImageToCloudinary(
            thumbnail,
            "StudyNotion"
        );

        const createNewCourse = await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn,
            instructor: instructorUserId,
            price,
            tag: tag,
            thumbnail: uploadThumnail.secure_url,
        });
        //update the courses of the instructor id so that instructor have access of course
        await User.findByIdAndUpdate(
            instructorUserId,
            { $push: { courses: createNewCourse._id } },
            { new: true }
        );

        //update the tag - just add the course id into tag
        await Tags.findByIdAndUpdate(
            tag,
            { $push: { course: createNewCourse._id } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "course created successfully",
            data: createNewCourse,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Inernal server error",
            error: error.message,
        });
    }
};
