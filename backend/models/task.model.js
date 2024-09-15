const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['assigned', 'ongoing', 'completed'],
        default: 'assigned'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignedToEmail: String
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
