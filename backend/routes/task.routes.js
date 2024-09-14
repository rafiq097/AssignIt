const express = require("express");
const router = express.Router();
const { createTask } = require("../controllers/team.controllers.js");

router.post('/create', createTask);

module.exports = router;