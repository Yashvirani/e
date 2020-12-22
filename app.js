require("dotenv").config();
const mongoose = require('mongoose');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");



mongoose.connect('mongodb+srv://Yashvirani:bXyXJ8CyYuGBzIbX@mern.ao9ub.mongodb.net/test',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true 
});

mongoose.connection
                .once("open", () => console.log("Connected"))
                .on("error", error => {
                    console.log("Your Error",error);
                });

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

const port = process.env.PORT || 8000;

app.listen(port,() => {
    console.log(`Running on Port ${port}`);
});