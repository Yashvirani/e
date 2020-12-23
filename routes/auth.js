const express = require("express");
const router = express.Router();
const { check, validationResult}  = require('express-validator');
const {signout,signup,signin} = require("../controllers/auth");

router.post("/signup",[
    check("name","Name must contain atleast 3 Characters!").isLength({min:3}),
    check("email","Check Your Email!").isEmail(),
    check("email","Password must have atleast 3 Characters!").isLength({min:3})
],signup);

router.post("/signin",[
    check("email","Check Your Email!").isEmail(),
    check("email","Password must have atleast 3 Characters!").isLength({min:3})
],signin);

router.get("/signout",signout);


module.exports = router;