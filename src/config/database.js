const mongoose = require("mongoose");

const url2 = process.env.MONGODB_URL;

const connectDB = async () => {
    await mongoose.connect(url2);
}

module.exports = {connectDB};