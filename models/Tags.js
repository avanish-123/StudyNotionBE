const mongoose = require('mongoose');
const tagsSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    discription:{
        type: String,
    },
    course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    }

})
module.exports = mongoose.model('Tags', tagsSchema)