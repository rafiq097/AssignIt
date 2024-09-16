const nodemailer = require("nodemailer");
require('dotenv').config();
const Task = require("../models/task.model.js");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const notifyEmail = async (req, res) => {
    const { taskId, assignedToEmail } = req.body;

    if (!taskId || !assignedToEmail) {
        return res.status(400).json({ message: "Missing taskId or assignedToEmail" });
    }

    try {

        const task = await Task.findById(taskId);
        let text;
        if(task.status == "assigned")
            text = `You have been assigned to a task ${task.title}. Please check it`;
        else if(task.status == "ongoing")
            text = `Reminder to completed your Ongoing Task ${task.title}`;
        else
            text = `Congratulations on completing Task ${task.title}`

        await transporter.sendMail({
            from: "thanosbusiness59l@gmail.com",
            to: assignedToEmail,
            subject: "Task Notification",
            text: text,
        });

        res.status(200).json({ message: "Notification sent successfully" });
    } catch (error) {
        console.error("Error sending notification email", error);
        res.status(500).json({ message: "Failed to send notification" });
    }
};

module.exports = { notifyEmail };
