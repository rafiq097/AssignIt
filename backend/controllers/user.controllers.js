const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const loginUser = async (req, res) => {
    console.log("login called");
    try {
        console.log(req.body);
        const { email, name } = req.body;
        if (!email || !name)
            return res.status(400).json({ message: "Incorrect Details" });

        let role;
        if (email == "rafiqshaik097@gmail.com")
        {
            role = "admin";
        }

        let user = await User.findOne({ email: email });
        if (!user) {
            user = new User({ email, name, role: role });
            await user.save();
            console.log(user);
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, name: user.name, tasks: user.tasks, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({
            message: "Logged In Successfully",
            token,
            user: {
                id: user._id, email: user.email, name: user.name, tasks: user.tasks, role: user.role
            }
        });
    }

    catch (err) {
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send({ users: users });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const addRole = async (req, res) => {
    console.log(req.params);
    try {
        // const email = req.params.email;
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        let tempUser = await User.findById(id);
        if (!tempUser) {
        return res.status(404).json({ message: 'User not found' });
        }

        let role = tempUser.role;

        const user = await User.findByIdAndUpdate(id, { role: role }, { new: true, runValidators: true });
        console.log(user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User updated successfully',
            user,
        });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'An error occurred while updating the user' });
    }
};


module.exports = { loginUser, getAllUsers, addRole };