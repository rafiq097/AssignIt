const mongoose = require("mongoose");

const bro = process.env.MONGO_URI;
export const connectDB = async () => {
    await mongoose.connect(bro);
};
