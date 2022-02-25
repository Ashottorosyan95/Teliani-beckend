const bcrypt = require('bcrypt');
const {body, validationResult} = require("express-validator");
const {
    User,
    Color,
    Cartuser,
    Wishlist,
    sequelize,
    ProductData,
    ProductSize,
    UserContact,
    OrderProduct,
    Order,
    ProductPicture,
    ProductCategoryes,
    ProductSizeContact,
    ProductCategoryesContact,
} = require("../model/user");
let passLength = 10;

class PostControler{
    constructor(){

    }

    async signUp(req, res) {
        let error = validationResult(req);
        let err = error.errors;
        let data = {};
        if(error.isEmpty()){
            let hash = bcrypt.hashSync(req.body.password, passLength)
            data = await User.create({...req.body, password: hash});
            req.session.errors = undefined;
        }
        else{
            req.session.errors = err;
        }
        if(req.session.errors){
            data = {};
            for (let e of req.session.errors) {
                if(data[e.param] == undefined){
                    data[e.param] = e.msg
                }
            }
            res.send({data, error: true})
        } else {
            res.send({data})
        }
    }

    async login(req, res) {
        let error = validationResult(req);
        let err = error.errors;
        let data = {};
        let hasErrors = false;
        if(error.isEmpty()){
            req.session.errors = undefined;
            User.findOne({ where: {email: req.body.email} }).then(user => {
                if(user) {
                    let checkPass = bcrypt.compareSync(req.body.password, user.password);
                    if(checkPass) {
                        data = {...user.dataValues, token: bcrypt.hashSync(user.email, passLength)};
                    } else {
                        data = {
                            email: '',
                            password: 'Գաղտնաբառը սխալ է'
                        };
                        hasErrors = true;
                    }
                } else {
                    data = {
                        email: 'Էլ․ հասցեն սխալ է',
                        password: ''
                    };
                    hasErrors = true;
                }
                res.send({data, error: hasErrors})
            })
        }
        else {
            req.session.errors = err;
            data = {};
            for (let e of req.session.errors) {
                if(data[e.param] == undefined){
                    data[e.param] = e.msg
                }
            }
            res.send({data, error: true})
        }
    }

    async loggedInUser(req, res) {
        let userId = req.body.userId;
        let data = {};
        let hasErrors = false;
        if(userId) {
            User.findOne({ where: {id: userId} }).then(user => {
                if(user) {
                    data = user;
                } else {
                    data = {};
                    hasErrors = true;
                }
                res.send({data, error: hasErrors});
            })
        }
    }

    async updateUserDetails(req, res) {
        const img = req.file ? req.protocol + '://' + req.get('host') + '/photo/' + req.file.filename : null;
        const user = await User.findOne({where: {email: req.body.user_email}});
        if (!user) {
            res.send({success: false});
        }

        user.username = req.body.username;
        user.avatar = req.body.avatar && req.body.avatar !== 'null' ? req.body.avatar : img;
        await user.save();
        res.send({result: user, success: true});
    }

    async orderUser(req,res) {
        const orderProductsArr = [];
        const {name, surname, email, number, address, Additionalnotes} = req.body.data.billingInfo;
        const productIds = req.body.data.productIds;
        const data = {
            name, 
            surname, 
            email, 
            number, 
            address, 
            additionalNotes: Additionalnotes,
            paymentMethod: req.body.data.paymentMethod,
            cartTotal: req.body.data.cartTotal,
            status: 'pending',
            userId: req.body.data.userId,
        }
        const newOrder = await Order.create({...data});
        for(let i = 0; i < productIds.length; i++) {
            orderProductsArr.push({quantity: productIds[i].quantity, size: productIds[i].size, orderId: newOrder.id, productId: productIds[i].productId})
            const prod = await ProductData.findOne({where: {id: productIds[i].productId}});
            prod.count = prod.count - productIds[i].quantity;
            await prod.save();
        }
        await OrderProduct.bulkCreate(orderProductsArr);
        if(req.body.data.userId) {
            Cartuser.destroy({
                where: {
                    userId: req.body.data.userId
                }
            });
        }
        res.redirect(`/order?paymentMethod=${newOrder.paymentMethod}`);
    }

    async userConatct(req,res) {
        const {name, surname, email, number, address, Additionalnotes} = req.body.billingInfo;
        const data = {
            name, 
            surname, 
            email, 
            number, 
            address, 
            Additionalnotes, 
            userId: req.body.userId
        }
        await UserContact.create({...data})
        res.redirect(`/user_contact?userId=${req.body.userId}`)
    }
 
    async productColor(req,res){
        await Color.create({...req.body});
        res.redirect('/color')
    }

    async wishListUser(req,res) {
        await Wishlist.create({...req.body})
        res.redirect(`/wishlist?userId=${req.body.userId}`)
    }

    async cartUser(req,res) {
        await Cartuser.create({...req.body})
        res.redirect(`/cart?userId=${req.body.userId}`)
    }

   

    async addProduct(req, res){
        const img = req.protocol + '://' + req.get('host');
        const reqFiles = [];
        const productPhotosArr = [];
        const productCategoriesArr = [];
        const productSizeArr = [];
        
        const parsedProduct = JSON.parse(req.body.product);
        const parsedProductCategories = JSON.parse(req.body.productCategories);
        const parsedProductSize = JSON.parse(req.body.productSize);
        const newProduct = await ProductData.create({...parsedProduct});
        
        for (let i = 0; i < req.files.length; i++) {
            reqFiles.push(img + '/photo/' + req.files[i].filename)
        }
        for(let i = 0; i < reqFiles.length; i++) {
            productPhotosArr.push({img: reqFiles[i], productId: newProduct.id})
        }
        for(let i = 0; i < parsedProductCategories.length; i++) {
            productCategoriesArr.push({productId: newProduct.id, categoryId: parsedProductCategories[i]})
        }
        for(let i = 0; i < parsedProductSize.length; i++) {
            productSizeArr.push({productId: newProduct.id, sizeId: parsedProductSize[i]})
        }
        
        await ProductPicture.bulkCreate(productPhotosArr);
        await ProductCategoryesContact.bulkCreate(productCategoriesArr);
        await ProductSizeContact.bulkCreate(productSizeArr)
        res.redirect("/product");
    }

    async addCategory(req,res) {
        await ProductCategoryes.create({...req.body})
        res.redirect("/category")
    }

    async addSize(req,res) {
        await ProductSize.create({...req.body})
        res.redirect("/product-size")
    }


    async deleteProductSIze(req, res) {
        const id = req.body.id;
        ProductSize.destroy({
            where: {
                id: id
            }
        });
        res.redirect("/product-size")
    }

    async deleteCategory(req, res) {
        const id = req.body.id;
        ProductCategoryes.destroy({
            where: {
                id: id
            }
        });
        res.redirect("/category")
    }

    async deleteProduct(req, res) {
        const id = req.body.id;
        ProductData.destroy({
            where: {
                id: id
            }
        });
        res.redirect("/product")
    }

    async deleteWishlist(req, res) {
        const id = req.body.id;
        Wishlist.destroy({
            where: {
                id: id
            }
        });
        res.redirect(`/wishlist?userId=${req.body.userId}`)
    }

    async deleteCart(req, res) {
        const id = req.body.id;
        Cartuser.destroy({
            where: {
                id: id
            }
        });
        res.redirect(`/cart?userId=${req.body.userId}`)
    }

    async clearCart(req, res) {
        const userId = req.body.userId;
        Cartuser.destroy({
            where: {
                userId: userId
            }
        });
        res.redirect(`/cart?userId=${req.body.userId}`)
    }

    async updateStatus(req, res) {
        const order = await Order.findOne({where: {id: req.body.id}});
        order.status = req.body.newStatus;
        await order.save();
        res.redirect(`/getUserOrders`);
    }

    async deleteOrder(req, res) {
        const id = req.body.id;
        Order.destroy({
            where: {
                id: id
            }
        });
        res.redirect(`/getUserOrders`);
    }
}

module.exports = new PostControler;
