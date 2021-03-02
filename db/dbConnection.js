const mongoose = require('mongoose');

const mongoDB =  'mongodb://localhost:27017/ecomDB'
// const mongoDB =  'mongodb://127.0.0.1/ecomDB'

// Connecting database
module.exports.connectDB = async () => {
    try {
        await mongoose.connect(
            mongoDB,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true
            },
            () => console.log('database connected successfully'))
    } catch (err) {
        console.error(err)
    }
}