const Product = require("../models/product");
const User = require("../models/user");
const formidable = require("formidable");
const lodash = require("lodash");
const fs = require("fs");

exports.getProductById = (req,res,next,id) => {
    Product.findById(id)
    .populate("category")
    .exec((err,prod) => {
        if(err || !prod){
            return res.status(400).json({
                error:"Couldn't find the product"
            });
        };
        req.product = prod;
        next();
    })
}

exports.createProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,(err,fields,file) => {
        if(err){
            return res.status(400).json({
                error:"Problem with Image"
            });
        };
        //destructuring the received form-data from frontend
        const {name,description,price,category,stock} = fields;

        if(
            !name || 
            !description ||
            !price ||
            !category ||
            !stock
        ){
            return res.status(400).json({
                error:"Include all fields"
            });
        }
        let product = new Product(fields);
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error:"File to be less than 3 Mb"
                });
            };
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }
        product.save((err,product) => {
            if(err){
                return res.status.json({
                    error:"Couldn't add product"
                });
            };
            res.json(product);
        });
    });
};

exports.getProduct = (req,res) => {
    req.product.photo = undefined;
    return res.json(req.product);
};

exports.photo = (req,res,next) => {
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType);
        return res.send(req.product.photo.data);
        
    };
    next();
};

exports.deleteProduct = (req,res) => {
    let product = req.product;
    product.remove((err,deletedProduct) => {
        if(err){
            return res.status(400).json({
                error:"Failed to delete the product!"
            });
        };
        res.json({
            message:"Deleted Successfully!",
            deletedProduct
        });
    });
};

exports.updateProduct = (req,res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req,(err,fields,file) => {
        if(err){
            return res.status(400).json({
                error:"Problem with Image"
            });
        };
        //product updation
        
        let product = req.product;
        product = lodash.extend(product,fields);
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error:"File to be less than 3 Mb"
                });
            };
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }
        product.save((err,product) => {
            if(err){
                return res.status.json({
                    error:"Couldn't update product"
                });
            };
            res.json(product);
        });
    });
};

exports.getAllProducts = (req,res) => {
    // Query is in form of string so parsing it to int
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    // -ve sign indicate removal in select
    Product.find()
            .select("-photo")
            .populate("category")
            .sort([[sortBy,"asc"]])
            .exec((err,products) => {
                if(err){
                    return res.status(400).json({
                        error:"Couldn't fetch the Products"
                    });
                };
                res.json(products);
            }) 
};

exports.updateStock = (req,res,next) => {
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter:{_id:prod._id},
                update:{$inc:{stock: -prod.count,sold: +prod.count}}
            }
        }
    });
    Product.bulkWrite(myOperations,{},(err,product) => {
        if(err){
            return res.status(400).json({
                error:"Couldn't Perform Bulk Operations"
            });
        };
        next();
    })
};

exports.getAllUniqueCategories = (req,res) => {
    Product.distinct("category",{},(err,categories) => {
        if(err){
            return res.status(400).json({
                error:"Failed to fetch all Categories"
            });
        };
        return res.json(categories);
    });
};