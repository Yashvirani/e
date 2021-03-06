const User = require("../models/user");
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
const { check, validationResult}  = require('express-validator');


exports.signup = (req,res) => {
   const errors = validationResult(req);
   if(!errors.isEmpty()){
        return res.status(422).json({
            error:errors.array()[0].msg
        })
   }
   const user = new User(req.body);
   user.save((err,user) => {
       if(err){
           return res.status(400).json({
               err: "Can't save the user!"
           });
       }
       res.json({
           name:user.name,
           email:user.email,
           id:user._id
       });
   });
};

exports.signin = (req,res) => {
    const {email,password} = req.body;
    const errors = validationResult(req);
   if(!errors.isEmpty()){
        return res.status(422).json({
            error:errors.array()[0].msg
        })
   }

   User.findOne({email} ,(err,user) => {
       if(err || !user){
           return res.status(400).json({
               error:"Email dont exist!"
           })
       }
       if(!user.authenticate(password)){
            return res.status(400).json({
                error:"Email and Password dont match!"
            })
       }
       //create token
       const token = jwt.sign({_id:user._id},process.env.SECRET);
       //store token
       res.cookie("token",token,{expire: new Date()+9999});
       //response to frontend
       const {_id,name,email,role} = user;
       return res.json({token,user:{_id,name,email,role}});
   })

};


exports.signout = (req,res) => {
    res.clearCookie("token");
    res.json({
        message:"Signed out Successfully!"
    })
};

// protected routes

exports.isSignedIn = expressJwt({
    secret:process.env.SECRET,
    userProperty:"auth"
});

// custom middleware

exports.isAuthenticated = (req,res,next) => {
    const checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error:"ACCESS DENIED"
        });
    }
    next();
}

exports.isAdmin = (req,res,next) => {
    if (req.profile.role === 0){
        return res.status(403).json({
            error:"You dont have admin rights.."
        });
    }
    next();
}