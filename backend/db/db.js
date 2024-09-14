const mongoose = require("mongoose");

const bro = process.env.MONGO_URI;
const connectDB = async () => {
    try {
        await mongoose.connect(bro)
        .then(() => console.log("Connected to MongoDB"));
    } catch (err) {
        console.log(err.message);
    }
};

module.exports = connectDB;