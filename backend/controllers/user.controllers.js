const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const loginUser = async (req, res) => {
    try {
        const { email, name } = req.body;
        if (!email || !name)
            return res.status(400).json({ message: "Incorrect Details" });

        let user = await User.findOne({ email: email, name: name });
        if (!user) {
            user = new User({ email, name });
            await user.save();
            console.log(user);
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({
            message: "Logged In Successfully",
            token,
            user: {
                id: user._id, email: user.email, name: user.name
            }
        });
    }

    catch (err) {
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { loginUser };