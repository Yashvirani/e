require("dotenv").config();
const mongoose = require('mongoose');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");



// mongodb connection
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

// middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Routes
app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);


//Port
const port = process.env.PORT || 8000;

//server
app.listen(port,() => {
    console.log(`Running on Port ${port}`);
});