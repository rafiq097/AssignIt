const express = require("express");
const router = express.Router();
const { createTask, getUserTasks, getAllTasks, updateTask, deleteTask } = require("../controllers/task.controllers.js");
const verifyEmail = require("../middlewares/auth.js");

router.get('/get', verifyEmail, getUserTasks);
router.get('/gettasks', getAllTasks)
router.post('/create', createTask);
router.put('/update/:id', updateTask);
router.delete('/delete/:id', deleteTask);

module.exports = router;