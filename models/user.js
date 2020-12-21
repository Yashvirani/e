const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        maxLength:32,
        trim:true
    },
    lastname:{
        type:String,
        required:true,
        maxLength:32,
        trim:true

    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    userInfo:{
        type:String,
        trim:true
    },
    encry_password:{
        type:String,
        required:true
    },
    salt:String,
    role:{
        type:Number,
        default:0
    },
    purchase:{
        type:Array,
        default:[]
    }
});

userSchema.method = {
    securePassword: function(plainpassword){
        if(!plainpassword){
            return "";
        }
        try{
            return crypto.createHmac('sha256', this.salt)
            .update(plainpassword)
            .digest('hex');
        }
        catch(err){
            return "";
        }
    }
}

module.exports = mongoose.model("User",userSchema);