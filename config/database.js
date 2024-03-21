const mongoose = require('mongoose')
exports.dbConnect = (url) => {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('database connection established');
    }).catch((error) => {
        console.log('database connection failed');
        console.error(error);
        process.exit(1);
    })
}