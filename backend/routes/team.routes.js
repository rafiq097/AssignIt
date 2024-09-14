const express = require("express");
const router = express.Router();
const { createTeam } = require("../controllers/team.controllers.js");

router.post('/create', createTeam);

module.exports = router;