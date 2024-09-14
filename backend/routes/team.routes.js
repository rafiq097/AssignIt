const express = require('express');
const router = express.Router();
const { createTeam, getTeam, updateTeam, deleteTeam } = require('../controllers/team.controllers.js');

router.get('/get/:id', getTeam);
router.post('/create', createTeam);
router.patch('/update/:id', updateTeam);
router.delete('/delete/:id', deleteTeam);

module.exports = router;