const express = require("express");
const router = express.Router();
const { loginUser, getAllUsers, addRole } = require("../controllers/user.controllers.js");

router.post('/login', loginUser);
router.get('/getusers', getAllUsers);
router.put('/updateRole/:id', addRole);

module.exports = router;