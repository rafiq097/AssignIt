const express = require("express");
const app = express();
require('dotenv').config();
const cors = require('cors');

const connectDB = require("./db/db.js");
const verifyToken = require("./middlewares/auth.js");

const userRoutes = require("./routes/user.routes.js");
const taskRoutes = require("./routes/task.routes.js");
// const teamRoutes = require("./routes/team.routes.js");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

connectDB();
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
// app.use("/teams", teamRoutes);

app.get('/', verifyToken, (req, res) => {
    console.log("Poor Bro");

    res.status(200).json({
        message: "Logged In Successfully",
        token: req.token,
        user: req.user
    })
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Running on PORT ${PORT}`);
});