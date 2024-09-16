const express = require("express");
const router = express.Router();
const { loginUser, getAllUsers, addAdmin } = require("../controllers/user.controllers.js");

router.post('/login', loginUser);
router.get('/getusers', getAllUsers);
router.put('/updateAdmin/:id', addAdmin);

module.exports = router;