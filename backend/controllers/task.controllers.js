const Task = require("../models/task.model.js");

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).json({ tasks });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};

const createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json({ task });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};

const updateTask = async (req, res) => {
    try {
        const { taskID } = req.params.id;
        const task = await Task.findOneAndUpdate({ taskID }, req.body, { new: true, runValidators: true });
        if (!task)
            return res.status(404).json({ message: "NO Such Task" });


        res.status(200).json({ task: task, success: "Successful" });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { taskID } = req.params.id;
        const task = await Task.findOneAndDelete(taskID);
        if (!task)
            return res.status(404).json({ message: "NO Such Task" });


        res.status(200).json({ task: task, success: "Successful" });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };