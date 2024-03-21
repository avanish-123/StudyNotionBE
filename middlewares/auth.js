const jwt = require('jsonwebtoken')
require('dotenv').config()
//auth, isAdmin, isStudent, isInstructor



//auth
exports.isAuth = async (req,res,next) => {
    try {
        const token = req.headers['authorization'].replace('Bearer ','')
        
        if(!token){
            return res.status(400).json({
                success: false,
                message: "token not available for authorization"
            })
        }
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decode
        } catch (error) {
            return res.status(400).json({
                success:false,
                message:"token is invalid"
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:'internal server error',
            error: error.message
        })
        
    }

}




exports.isAdmin = async (req,res, next)=>{
    try {
        if(req.user.accountType !== 'Admin'){
            return res.status(400).json({
                success: false,
                message:"you are not Admin"
            })
        }
        next()        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}


exports.isStudent = async(req,res,next)=>{
    try {
        if(req.user.accountType!=='Student'){
            return res.status(401).json({
                success: false,
                message:"you are not student"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:"Inernal server error",
            error:error.message
        })
        
    }
}


exports.isInstructor = async(req,res,next)=>{
    try {
        if(req.user.accountType!== 'Instructor'){
            return res.status(401).json({
                success:false,
                message:"you are not instructor"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error: error.message
        })
        
    }
}