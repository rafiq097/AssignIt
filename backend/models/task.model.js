const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['assigned', 'ongoing', 'completed'],
        default: 'assigned'
    },
    assignedToID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignedToEmail: {
        type: String
    }
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
