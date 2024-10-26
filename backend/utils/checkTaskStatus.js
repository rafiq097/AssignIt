const Task = require("../models/task.model.js");

const checkTaskStatus = async (req, res, next) => {
    try {
        const tasks = await Task.find({});
        
        let completedCount = 0;
        for (let i = 0; i < tasks.length; i++) {
            const allSubTasksCompleted = tasks[i].subTasks.every(subTask => subTask.status === "completed");

            if (allSubTasksCompleted && tasks[i].status !== "completed" && tasks[i].subTasks.length > 0) {
                tasks[i].status = "completed";
                await tasks[i].save();
                completedCount++;
            }
        }

        console.log(`Marked ${completedCount} tasks as completed.`);
        next();
    } 
    catch (error) {
        console.error(error);
        next(error);
    }
};

module.exports = checkTaskStatus;