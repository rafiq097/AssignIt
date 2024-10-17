const express = require("express");
const router = express.Router();
const { createTask, getUserTasks, getAllTasks, updateTask, deleteTask , addSubTask, updateSubTask, deleteSubTask } = require("../controllers/task.controllers.js");
const verifyEmail = require("../middlewares/auth.js");

const { notifyEmail } = require("../utils/notifyEmail.js");

router.get('/get', verifyEmail, getUserTasks);
router.get('/gettasks', getAllTasks)
router.post('/create', createTask);
router.put('/update/:id', updateTask);
router.delete('/delete/:id', deleteTask);

router.post('/create-subtask/:id', addSubTask);
router.put('/update-subtask/:parentId/:id', updateSubTask);
router.delete('/delete-subtask/:parentId/:id', deleteSubTask);

router.post('/notify', notifyEmail);

module.exports = router;