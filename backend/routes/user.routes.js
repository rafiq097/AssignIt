const express = require("express");
const router = express.Router();
const { loginUser, getAllUsers } = require("../controllers/user.controllers.js");

router.post('/login', loginUser);
router.get('/getusers', getAllUsers);

module.exports = router;