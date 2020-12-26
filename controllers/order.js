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
    });
};

exports.createOrder = (req,res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((err,order) => {
        if(err){
            return res.status(400).json({
                error:"Couldn't save Order!"
            });
        };
        res.json(order);
    })
}