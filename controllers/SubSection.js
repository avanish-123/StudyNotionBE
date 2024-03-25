const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
exports.createSubSection = async(req,res)=>{
    try {
        const {title, timeDuration, description, videoUrl, sectionId} = req.body;
        if(!title || !timeDuration || !description || !videoUrl || !sectionId ){
            return res.status(400).json({
                success: false,
                message: "please fill all the required fields"
            })
        }
        //check if any section is associated with the given section id or not
        const checkSection = await Section.findById(sectionId);
        if(!checkSection){
            return res.status(400).json({
                success: false,
                message: "no section is associated with this section id"
            })
        }
        // save in SubSection collection
        const createdSubSection = await SubSection.create({title, timeDuration, videoUrl, description});

        //push the id into section collection
        await Section.findByIdAndUpdate(sectionId, {$push:{subSection:createdSubSection._id}},{new:true});
        return res.status(200).json({
            success: true,
            message: "SubSection created successfully"
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

exports.updateSubSection = async (req,res) => {
    try {
        const {title, description, timeDuration, videoUrl, subSectionId} = req.body;
        //check subsection present or not in database with given id
        const checkSubSection = await SubSection.findById(subSectionId);
        if(!checkSubSection){
            return res.status(400).json({
                success: false,
                message: "No sub section associated with the given id"
            })
        }
        await SubSection.findByIdAndUpdate(subSectionId,{title, description, timeDuration, videoUrl})
        return res.status(200).json({
            success: true,
            message: "Seb Section Updated successfully"
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        }) 
    }
}

exports.deleteSubSection = async(req,res) => {
    try {
        const {subSectionId, sectionId} = req.body;
        //check section and subsection present or not in database with given ids
        const checkSection = await Section.findById(sectionId);
        const checkSubSection = await SubSection.findById(subSectionId);
        if(!checkSection || !checkSubSection){
            return res.status(400).json({
                success: false,
                message: "no section or subsection found"
            })
        }

        await SubSection.findByIdAndDelete(subSectionId);
        await Section.findByIdAndUpdate(sectionId,{$pull : {subSection: subSectionId}})
        return res.status(200).json({
            success: true,
            message: "Deleted Successfully"
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
        
    }

}