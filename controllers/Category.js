//create and get all the category
const Category = require("../models/Category");

exports.createCategory = async (req,res)=>{
    try {
        const {name, description} = req.body;
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: 'all fields are required'
            })
        }
        //create entry in db
        await Category.create({name, description});
        return res.status(200).json({
            success: true,
            message: 'category created successfully'
        })


        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Inernal server error",
            error:error.message
        })
        
    }
}


// get all the category
exports.getAllCategory = async (req,res)=>{
    try {
        const category = await Category.find({},{name: true, description: true})
        return res.status(200).json({
            success: true,
            data: category,
            message: 'category fetched successfully'            
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Inernal server error',
            error: error.message
        })
        
    }
}