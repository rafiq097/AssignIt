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
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'low',
    },
    dueDate: {
        type: Date,
    },
    assignedToID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    assignedToEmail: {
        type: String
    },
    subTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }]
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
