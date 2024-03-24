const Course = require("../models/Course");
const Section = require("../models/Section");

// createCourse 
exports.createSection = async(req,res) =>{
    try {
        const {sectionName,courseId} = req.body;
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "Please enter the section name"
            })
        }
        //check id present in any course or not
        const checkCourse = await Course.findById(courseId)
        if(!checkCourse){
            return res.status(400).json({
                success: false,
                message: "No course is associated with this course id"
            })
        }
        //if id present
        //save the entry in section collection
        const savedSection = await Section.create({sectionName})
        //update the course collection
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId, {$push:{courseContent: savedSection._id}},{new:true}).populate('courseContent').exec();
        return res.status(200).json({
            success: true,
            message:"Section created successfully",
            updatedCourseDetails
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Inernal server error',
            error: error.message
        })
        
    }

}


//updateCourse
exports.updateSection = async(req,res)=>{
    try {
        const {updateSectionContent, sectionId} = req.body;
        if(!updateSectionContent || !sectionId){
            return res.status(400).json({
                success: false,
                message: 'please enter all the fields',
            })
        }
        //check if any course associated with the given id or not
        const checkCourse = await Section.findById(sectionId);
        if(!checkCourse){
            return res.status(400).json({
                success: false,
                message: "No course is associated with the given course ID"
            })
        }
        //if id present
        const UpdatedSection = await Section.findByIdAndUpdate(sectionId,{sectionName:updateSectionContent},{new:true})
        return res.status(200).json({
            success: true,
            message:"Section Details updated successfully",
            UpdatedSection
        })

        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
        
    }
}

//delete section
exports.deleteSection = async(req,res)=>{
    try {
        const {sectionId,courseId} = req.body;
        if(!sectionId){
            return res.status(400).json({
                success: false,
                message:"Please enter id of the section"
            })
        }
        //check if section present or not with given section id
        const checkSection = await Section.findById(sectionId)
        if(!checkSection){
            return res.status(400).json({
                success: false,
                message: "No section associated with this section id"
            })
        }
        await Section.findByIdAndDelete(sectionId);
        await Course.findByIdAndUpdate(courseId, {$pull:{courseContent: sectionId}})
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully"
        })
        

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
        
    }
}