const {Order,ProductCart} = require("../models/order");

exports.getOrderById = (req,res,next,id) => {
    Order.findById(id)
        .populate("products.product","name price")
        .exec((err,orderCorrespondingToId) => {
        if(err){
            return res.status(400).json({
                error:"Cant find the order!"
            });
        };
        req.order = orderCorrespondingToId;
        next();
    })
}