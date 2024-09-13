const express = require("express");
const app = express();
require('dotenv').config();
const bodyParser = require("body-parser");

app.use(bodyParser());

app.get('/', (req, res) => {
    console.log("Poor Bro");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Running on PORT ${PORT}`);
});