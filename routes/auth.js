const express = require("express");
const router = express.Router();
const { check, validationResult}  = require('express-validator');
const {signout,signup,signin,isSignedIn} = require("../controllers/auth");

router.post("/signup",[
    check("name","Name must contain atleast 3 Characters!").isLength({min:1}),
    check("email","Check Your Email!").isEmail(),
    check("password","Password must have atleast 3 Characters!").isLength({min:3})
],signup);

router.post("/signin",[
    check("email","Check Your Email!").isEmail(),
    check("password","Password must have atleast 3 Characters!").isLength({min:3})
],signin);


router.get("/signout",signout);

router.get("/testroute",isSignedIn,(req,res) => {
    res.json(req.auth);
})


module.exports = router;