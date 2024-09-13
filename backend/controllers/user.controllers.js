const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

export const loginUser = async (req, res) => {
    try {
        const { email, name } = req.body;
        if(!email || !name)
            return res.status(400).json({ message: "Incorrect Details" });

        const user = new User({ email, name });
        await user.save();

        res.status(200).json({ message: "Logged In Successfully" });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};