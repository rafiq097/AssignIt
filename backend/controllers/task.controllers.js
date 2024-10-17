const Task = require("../models/task.model.js");
const User = require("../models/user.model.js");

const getUserTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedToEmail: req.user.email });
        res.status(200).json({ tasks });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};

const getAllTasks = async (req, res) => {
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
        const { assignedToEmail } = req.body;

        if (assignedToEmail) {
            console.log(assignedToEmail);
            const user = await User.findOne({ email: assignedToEmail });
            if (!user)
                return res.status(404).json({ message: "No such user found" });

            const task = await Task.create(req.body);
            task.assignedToID = user._id;
            await task.save();

            user.tasks.push(task);
            await user.save();

            console.log(task);
            console.log(user);
            res.status(201).json({ task });
        }
        else {
            const task = await Task.create(req.body);
            await task.save();

            console.log(task);
            res.status(201).json({ task });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const updateTask = async (req, res) => {
    console.log(req.body);
    console.log(req.params);
    try {
        const id = req.params.id;
        console.log(id);
        // const { assignedToEmail } = req.body;
        // if(assignedToEmail)
        // {
        //     const user = await User.findOne({ email: assignedToEmail });
        //     if(!user)
        //         return res.status(404).json({ message: 'User not found' });
        // }
        const task = await Task.findOneAndUpdate({ _id: id }, req.body, { new: true, runValidators: true });
        console.log(task);
        if (!task)
            return res.status(404).json({ message: "No Such Task" });


        res.status(200).json({ task: task, success: "Successful" });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error });
    }
};

const deleteTask = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        const task = await Task.findOneAndDelete({ _id: id });
        if (!task)
            return res.status(404).json({ message: "No Such Task" });


        console.log(task);
        res.status(200).json({ task: task, success: "Successful" });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
};

const addSubTask = async (req, res) => {
    try {
        const id = req.params.id;
        const parentTask = await Task.findOne({ _id: id });

        if (!parentTask) {
            return res.status(404).json({ message: "No Such Parent Task Found!" });
        }

        const { title, description, status, priority, dueDate, assignedToEmail } = req.body;

        let assignedToID = null;

        if (assignedToEmail) {
            const user = await User.findOne({ email: assignedToEmail });
            if (!user) {
                return res.status(404).json({ message: "No such user found" });
            }
            assignedToID = user._id;
        }

        const subTask = {
            title,
            description,
            status,
            priority,
            dueDate,
            assignedToID,
            assignedToEmail,
        };

        parentTask.subTasks.push(subTask);
        await parentTask.save();

        res.status(201).json({ message: "Sub-task added successfully", subTask });
    } catch (error) {
        res.status(500).json({ message: "Error adding Sub Task", error });
    }
};

const updateSubTask = async (req, res) => {
    const { parentId, id: subTaskId } = req.params;
    const { title, description, status, priority, dueDate, assignedToEmail } = req.body;

    try {
        const task = await Task.findById(parentId);

        if (!task) {
            return res.status(404).json({ message: "Parent task not found." });
        }

        const subTask = task.subTasks.id(subTaskId);
        if (!subTask) {
            return res.status(404).json({ message: "Sub-task not found." });
        }

        subTask.title = title || subTask.title;
        subTask.description = description || subTask.description;
        subTask.status = status || subTask.status;
        subTask.priority = priority || subTask.priority;
        subTask.dueDate = dueDate || subTask.dueDate;
        subTask.assignedToEmail = assignedToEmail || subTask.assignedToEmail;

        await task.save();
        res.status(200).json({ message: "Sub Task updated successfully.", subTask });
    } catch (error) {
        console.error("Error updating sub-task:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

const deleteSubTask = async (req, res) => {
    const { parentId, id: subTaskId } = req.params;

    try {
        const task = await Task.findById(parentId);

        if (!task) {
            return res.status(404).json({ message: "Parent task not found." });
        }

        const subTask = task.subTasks.id(subTaskId);
        if (!subTask) {
            return res.status(404).json({ message: "Sub-task not found." });
        }

        task.subTasks.pull({ _id: subTaskId });
        await task.save();

        res.status(200).json({ message: "Sub Task deleted successfully." });
    } catch (error) {
        console.error("Error deleting sub-task:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = { createTask, getUserTasks, getAllTasks, updateTask, deleteTask, addSubTask, updateSubTask, deleteSubTask };