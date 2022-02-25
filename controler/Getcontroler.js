const {getShop, where} = require("sequelize");
const e = require("connect-flash");
const { load } = require("dotenv");
const jwt = require("jsonwebtoken")
const {
    User,
    Color,
    Rating,
    Cartuser,
    Wishlist,
    ProductData,
    ProductSize,
    UserContact,
    OrderProduct,
    Order,
    ProductPicture,
    ProductCategoryes,
    ProductSizeContact,
    ProductCategoryesContact
} = require("../model/user");


class GetControler{
    constructor(){

    }

    async getLogin(req,res){
        let loggedInUser = await User.findAll();
        res.send({user:loggedInUser})
    }

    async GetProduct(req,res){
        let product = await ProductData.findAll({attributes:[
            "id",
            "labels",
            "rate",
            "title",
            "price",
            "sale_price",
            "description",
            "count",
        ]})
        for (let p of product) {  
            let ProductRating = await Rating.findAll({where:{productId:p.dataValues.id},attributes:['rate', 'count'],raw : true })
            let ProductColor = await Color.findAll({where:{productId:p.dataValues.id},attributes:['color', 'img', 'quantity'],raw : true })
            let ProductPhotos = await ProductPicture.findAll({where:{productId:p.dataValues.id},attributes:['img']})
            let ProductCategory = await ProductCategoryesContact.findAll({where:{productId:p.dataValues.id},attributes:['categoryId'],raw : true })
            let ProductSizes = await ProductSizeContact.findAll({where:{productId:p.dataValues.id},attributes:['sizeId'],raw : true })
            
            let cat = []
            for (let c of ProductCategory) {  
                cat.push(c.categoryId)
            
            }
            
            let siz = []
            for (let a of ProductSizes) {  
                siz.push(a.sizeId)
            }
            
            let categoryes = await ProductCategoryes.findAll({where:{id: cat},attributes:['id','name']})
            let size = await ProductSize.findAll({where:{id: siz},attributes:['id','name']})
            // let chekedSize = await Cartuser.findAll({attributes:['id','size']})

            p.dataValues.rating = ProductRating;
            p.dataValues.color = ProductColor;
            p.dataValues.pictures = ProductPhotos;
            p.dataValues.category  = categoryes ;
            p.dataValues.sizes  = size ;
            // p.dataValues.size  = +chekedSize[0]?.dataValues.size;
        }
        res.send({products:product})
    }

    async GetOrderProduct(req,res) {
      res.send({paymentMethod: req.query.paymentMethod})
    }

    async getUserOrders(req,res) {
        let orders = req.query.userId ? await Order.findAll({where: {userId: req.query.userId}}) : await Order.findAll();
        let ordersProducts = [];
        let products = [];
        for(let i = 0; i < orders.length; i++) {
            let temp = await OrderProduct.findAll({where: {orderId: orders[i].id}});
            for(let j = 0; j < temp.length; j++) {
                ordersProducts.push(temp[j]);
            }
        }
        ordersProducts = ordersProducts.filter((v,i,a) => a.findIndex( t => (t.productId === v.productId)) === i);
        for(let i = 0; i < ordersProducts.length; i++) {
            let temp = await ProductData.findOne({where: {id: ordersProducts[i].productId}});
            temp.dataValues.orderId = ordersProducts[i].orderId;
            temp.dataValues.quantity = ordersProducts[i].quantity;
            temp.dataValues.size = ordersProducts[i].size;
            products.push(temp);
        }
        res.send({orders, products});
    }

    async getAllOrders(req,res) {
        let orders = await Order.findAll();
        let ordersProducts = [];
        let products = [];
        for(let i = 0; i < orders.length; i++) {
            let temp = await OrderProduct.findAll({where: {orderId: orders[i].id}});
            for(let j = 0; j < temp.length; j++) {
                ordersProducts.push(temp[j]);
            }
        }
        ordersProducts = ordersProducts.filter((v,i,a) => a.findIndex( t => (t.productId === v.productId)) === i);
        for(let i = 0; i < ordersProducts.length; i++) {
            let temp = await ProductData.findOne({where: {id: ordersProducts[i].productId}});
            temp.dataValues.orderId = ordersProducts[i].orderId;
            temp.dataValues.quantity = ordersProducts[i].quantity;
            temp.dataValues.size = ordersProducts[i].size;
            products.push(temp);
        }
        res.send({orders, products});
    }

    async GetUserContact(req,res) {
        let conatct = await UserContact.findAll()
        res.send({conatct})
      }

    async GetWishlist(req,res) {
        let wishlist = await Wishlist.findAll({where: {userId: req.query.userId}})
        res.send({wishlist})
    }

    async GetCart(req,res) {
        let cart = await Cartuser.findAll({where: {userId: req.query.userId}})
        res.send({cart})
    }

    async adminprofile(req,res){
        req.flash('usId', req.user.id)
        res.send({status: "OK"})
    }

    async getCategories(req, res) {
        let prodCat = await ProductCategoryes.findAll();
        res.send({categories:prodCat});
    }

    async getProductSizes(req, res) {
        let prodSize = await ProductSize.findAll();
        res.send({sizes:prodSize});
    }
}

module.exports = new GetControler;