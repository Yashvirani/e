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
       if(err){
           res.status(400).json({
               error:"Email dont exist!"
           })
       }
       if(!user.authenticate(password)){
            return res.status(400).json({
                error:"Email and Password dont match!"
            })
       }

   })

}


exports.signout = (req,res) => {
    res.send("User Signou");
};

