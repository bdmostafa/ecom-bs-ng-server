const mongoose = require("mongoose");

// const mongoDB =  'mongodb://localhost:27017/ecomDB'

// Connecting database
module.exports.connectDB = async () => {
  try {
    await mongoose
      .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .then(() => console.log("MongoDB connected..."));
  } catch (err) {
    console.error(err);
  }
};
