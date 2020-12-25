const express = require("express");
const router = express.Router();
const {isAdmin,isAuthenticated,isSignedIn} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");
const {getCategoryById,createCategory,getCategory,getAllCategory} = require("../controllers/category");

router.param("userId",getUserById);
router.param("categoryId",getCategoryById);

router.post("/category/create/:userId",isSignedIn,isAuthenticated,isAdmin,createCategory);
router.get("/category/:categoryId",getCategory);
router.get("/categories",getAllCategory);




module.exports = router;