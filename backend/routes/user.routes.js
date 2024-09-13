const express = require("express");
const router = express.Router();
const loginUser = require("../controllers/user.controllers.js");

router.get('/login', loginUser);

module.exports = router;