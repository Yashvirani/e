const Category = require("../models/category");

exports.getCategoryById = (req,res,next,id) => {
    Category.findById(id).exec((err,cate) => {
        if(err || !cate){
            return res.status(400).json({
                error:"Category Not Found!"
            });
        }
        req.category = cate;
        next();
    })
    
}

exports.createCategory = (req,res) => {
    const category = new Category(req.body);
    category.save((err,category) => {
        if(err || !category){
            return res.status(400).json({
                error:"Category Not Found!"
            });
        }
        res.json({category});
    });
};

exports.getCategory = (req,res) => {
    return res.json(req.category);
}

exports.getAllCategory = (req,res) => {
    Category.find().exec((err,categories) => {
        if(err || !categories){
            return res.status(400).json({
                error:"Categories Not Found!"
            });
        }
        res.json(categories);
    })
}

exports.updateCategory = (req,res) => {
    const category = req.category;
    category.name = req.body.name;
    category.save((err,updatedCategory) => {
        if(err || !updatedCategory){
            return res.status(400).json({
                error:"Couldn't update Category!"
            });
        }
        res.json(updatedCategory);
    });
};

exports.removeCategory = (req,res) => {
    const category = req.category; //we could access category from above getCategoryById middleware
    category.remove((err,category) => {
        if(err || !category){
            return res.status(400).json({
                error:"Couldn't remove Category!"
            });
        }
        res.json({
            message:`Successfully deleted ${category}`
        });
    })
}