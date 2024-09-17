const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'manager', 'admin'],
        default: 'user'
    },
    teamsIn: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    }],
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;