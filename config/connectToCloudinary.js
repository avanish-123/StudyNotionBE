const cloudinary = require('cloudinary').v2;
exports.connectToCloudinary = (cloudName,apiKey,apiSecret) =>{
    try {
        cloudinary.config({
            cloud_name: `${cloudName}`,
            api_key: `${apiKey}`,
            api_secret: `${apiSecret}`,
        })
        console.log('cloudinary connection established')
    } catch (error) {
        console.log("error in cloudinary connection"),
        console.error(error.message);
    }
}