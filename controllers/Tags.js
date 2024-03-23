//create and get all the tags
const Tags = require("../models/Tags");

exports.createTag = async (req,res)=>{
    try {
        const {name, description} = req.body;
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: 'all fields are required'
            })
        }
        //create entry in db
        await Tags.create({name, description});
        return res.status(200).json({
            success: true,
            message: 'tag created successfully'
        })


        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Inernal server error",
            error:error.message
        })
        
    }
}


// get all the tags
exports.getAllTags = async (req,res)=>{
    try {
        const tags = await Tags.find({},{name: true, discription: true})
        return res.status(200).json({
            success: true,
            data: tags,
            message: 'tags fetched successfully'            
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Inernal server error',
            error: error.message
        })
        
    }
}