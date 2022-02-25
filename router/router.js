const express = require("express");
const router=express.Router();
const bcrypt=require('bcrypt');
const multer = require('multer');
const passport=require('passport');
const db = require("../model/database");
const {User}=require('./../model/user');
const {body}=require("express-validator");
const LocalStrategy=require('passport-local').Strategy;
const getControler = require("../controler/Getcontroler");
const Postcontroler = require("../controler/Postcontroler");

const DIR = './public/photo/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, Date.now() + '-' + fileName)
    }
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});


// type login
const isLoginedUser = (req,res, next)=>{
    if(req.isAuthenticated() && req.user.type==0){
        return next()
    }
    res.redirect("/")       
}

const isLoginedAdmin=(req,res,next)=>{
    if(req.isAuthenticated() && req.user.type==1){
        return next()
    }
    res.redirect("/")
}


// get inquiry

router.get("/login", getControler.getLogin);

router.get("/product", getControler.GetProduct);

router.get("/admin", isLoginedAdmin, getControler.adminprofile);

router.get('/order', getControler.GetOrderProduct);

router.get('/user_contact', getControler.GetUserContact);

router.get("/category", getControler.getCategories);

router.get("/product-size", getControler.getProductSizes);

router.get("/wishlist", getControler.GetWishlist);

router.get("/cart", getControler.GetCart);

router.get("/getUserOrders", getControler.getUserOrders);

router.get("/getAllOrders", getControler.getAllOrders);





// post inquiry

router.post('/register', [
    body('username').notEmpty().withMessage('Մուտքանուն դաշտը պարտադիր է'),
    body('email').notEmpty().withMessage('Էլ․ հասցե դաշտը պարտադիր է').isEmail().withMessage('Էլ․ հասցեն սխալ է'),
    body('password').notEmpty().withMessage('Գաղտնաբառ դաշտը պարտադիր է').isLength({min:8}).withMessage('Գաղտնաբառը պետք է պարունակի առնվազն 8 տառ')
], Postcontroler.signUp)

router.post('/login', [
    body('email').notEmpty().withMessage('Էլ․ հասցե դաշտը պարտադիր է'),
    body('password').notEmpty().withMessage('Գաղտնաբառ դաշտը պարտադիր է')
], Postcontroler.login);

router.post('/loggedInUser', Postcontroler.loggedInUser);

router.post('/updateUserDetails', upload.single("avatar"), Postcontroler.updateUserDetails);

router.post('/addProd', upload.array("imgCollection"), [body('title').notEmpty().withMessage('Էլ․ հասցե դաշտը պարտադիր է'),],Postcontroler.addProduct);

router.post('/order',  Postcontroler.orderUser);

router.post('/user-contact',  Postcontroler.userConatct);

router.post('/wish-list',  Postcontroler.wishListUser);

router.post('/cart-user',  Postcontroler.cartUser);

router.post('/deleteProduct', Postcontroler.deleteProduct);

router.post('/addCategory', Postcontroler.addCategory);

router.post('/addProductSize', Postcontroler.addSize);

router.post("/deleteCategory", Postcontroler.deleteCategory);

router.post("/delete-product-sizes", Postcontroler.deleteProductSIze);

router.post("/delete-cart", Postcontroler.deleteCart);

router.post("/clear-cart", Postcontroler.clearCart);

router.post("/delete-wishlist", Postcontroler.deleteWishlist);

router.post("/delete-order", Postcontroler.deleteOrder);

router.post("/update-status", Postcontroler.updateStatus);




passport.use('local', new LocalStrategy(
    async function(username, password, done) {
       console.log("before")
      let user=await User.findOne({where:{email:username}}) 
        if (!user) {
         done(null, false, { message: 'Incorrect username.' });
        }
        if(!bcrypt.compareSync(password, user.password)){
            done(null, false, { message: 'Incorrect password.' });

        }
        done(null, user);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(async function(id, done) {
    console.log(id)
    done(null, await User.findOne({where:{id}}))
});


module.exports=router
