const User = require("../models/user");

exports.getUserById = (req,res,next,id) => {
    User.findById(id).exec((err,user) => {
        if(err || !user){
            return res.status(400).json({
                error:"No user found!"
            })
        }
        req.profile = user;
        next();
    });
};

exports.getUser = (req,res) => {
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    return res.json(req.profile);
}

// exports.getAllUsers = (req,res) => {
//     User.find().exec((err,users) => {
//         if(err ||!users){
//             return res.status(403).json({
//                 error:"Couldn't Load Users!"
//             });
//         };
//         res.status(200).json(users);
//     })

// }

exports.updateUser = (req,res) => {
    User.findByIdAndUpdate(
        {_id:req.profile._id},
        {$set:req.body},
        {new:true,useFindAndModify:false },
        (err,user) => {
            if(err || !user){
                res.status(400).json({
                    error:"Not Authorized to Update!"
                });
            }
            user.salt = undefined;
            user.encry_password = undefined;
            res.status(200).json(user);
        }
    );
}