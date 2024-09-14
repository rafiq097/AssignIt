const express = require("express");
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require("../controllers/task.controllers.js");

router.get('/get', getTasks);
router.post('/create', createTask);
router.patch('/update/:id', updateTask);
router.delete('/delete/:id', deleteTask);

module.exports = router;