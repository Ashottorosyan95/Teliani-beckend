const {Sequelize, Model, DataTypes, BOOLEAN} = require('sequelize');

// const sequelize = new Sequelize('telianshoes_shop', 'telianshoes_arsen', 'yo42EZb5KMaH', {
//     host:'localhost',
//     dialect: 'mysql'
// })

const sequelize = new Sequelize('shoes-shop', 'root', '', {
    host:'localhost',
    dialect: 'mysql'
})

class User extends Model {}
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey :true
        },
        type: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        username: DataTypes.STRING,
        avatar:DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING
    },
    {
        modelName: 'users',
        sequelize

    }
)
User.sync();

class ProductData extends Model {}
ProductData.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey :true
        },
        labels:DataTypes.STRING,
        rate:DataTypes.STRING,
        // img:DataTypes.STRING,
        // hover_img:DataTypes.STRING,
        title:DataTypes.STRING,
        sale_price:DataTypes.INTEGER,
        price:DataTypes.INTEGER,
        description:DataTypes.STRING,
        // rate:DataTypes.INTEGER,
        count:DataTypes.INTEGER
    },
    {
        modelName: 'product',
        sequelize
    }
)
ProductData.sync();

class ProductPicture extends Model {}
ProductPicture.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey :true
        },
        img:DataTypes.STRING,
    },
    {
        modelName:'pictures',
        sequelize
    }
)
ProductPicture.belongsTo(ProductData, { onDelete: 'cascade' })
ProductPicture.sync()

class ProductCategoryes extends Model{}
ProductCategoryes.init(
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        name:DataTypes.STRING,
    },
    {
        modelName:'category',
        sequelize
    }
)
ProductCategoryes.sync()

class ProductCategoryesContact extends Model{}
ProductCategoryesContact.init(
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
    },
    {
        modelName:'product_categorys',
        sequelize
    }
)
ProductCategoryesContact.belongsTo(ProductData, {onDelete: 'cascade'})
ProductCategoryesContact.belongsTo(ProductCategoryes, {onDelete: 'cascade'})
ProductCategoryesContact.sync()

class ProductSize extends Model{}
ProductSize.init(
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        name:DataTypes.STRING,
    },
    {
        modelName:'size',
        sequelize
    }
)
ProductSize.sync()

class ProductSizeContact extends Model{}
ProductSizeContact.init(
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
    },
    {
        modelName:'product_size',
        sequelize
    }
)
ProductSizeContact.belongsTo(ProductData, {onDelete: 'cascade'})
ProductSizeContact.belongsTo(ProductSize, {onDelete: 'cascade'})
ProductSizeContact.sync()


class Rating extends Model {}
Rating.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey :true
        },
        rate:DataTypes.INTEGER,
        count:DataTypes.INTEGER
    },
    {
        modelName: 'rating',
        sequelize
    }
)
Rating.belongsTo(ProductData)
Rating.sync();

class Color extends Model {}
Color.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey :true
        },
        color:DataTypes.STRING,
        img:DataTypes.STRING,
        quantity:DataTypes.INTEGER
    },
    {
        modelName: 'color',
        sequelize
    }
)
Color.belongsTo(ProductData)
Color.sync();

class Order extends Model {}
Order.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey :true
        }, 
        name: DataTypes.STRING,
        surname: DataTypes.STRING,
        email: DataTypes.STRING,
        number: DataTypes.INTEGER,
        address: DataTypes.STRING,
        additionalNotes: DataTypes.STRING,
        paymentMethod: DataTypes.STRING,
        cartTotal: DataTypes.INTEGER,
        status: DataTypes.STRING,
    },
    {
        modelName: 'order',
        sequelize
    }
)
Order.belongsTo(User, {onDelete: 'cascade'});

Order.sync()

class OrderProduct extends Model {}
OrderProduct.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey :true
        },
        quantity:DataTypes.INTEGER,
        size:DataTypes.INTEGER,
    },
    {
        modelName: 'order_product',
        sequelize
    }
)
OrderProduct.belongsTo(Order, {onDelete: 'cascade'});
OrderProduct.belongsTo(ProductData);

OrderProduct.sync()

class UserContact extends Model {}
UserContact.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey :true
        },
        name: DataTypes.STRING,
        surname: DataTypes.STRING,
        email: DataTypes.STRING,
        number: DataTypes.INTEGER,
        address: DataTypes.STRING,
        Additionalnotes: DataTypes.STRING 
    },
    {
        modelName: 'user_contact',
        sequelize
    }
)
UserContact.belongsTo(User, {onDelete: 'cascade'})
UserContact.sync()

class Wishlist extends Model {}
Wishlist.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey :true
        },
        img: DataTypes.STRING,
        title:DataTypes.STRING,
        price: DataTypes.INTEGER,
    },
    {
        modelName: 'wishlist',
        sequelize
    }
)
Wishlist.belongsTo(User, {onDelete: 'cascade'});
Wishlist.belongsTo(ProductData, {onDelete: 'cascade'});
Wishlist.sync() 

class Cartuser extends Model {}
Cartuser.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey :true
        },
        img: DataTypes.STRING,
        title:DataTypes.STRING,
        quantity:DataTypes.INTEGER,
        price: DataTypes.INTEGER,
        size: DataTypes.STRING
    },
    {
        modelName: 'cart',
        sequelize
    }
)
Cartuser.belongsTo(User, {onDelete: 'cascade'});
Cartuser.belongsTo(ProductData, {onDelete: 'cascade'});
Cartuser.sync() 



module.exports={
    User,
    Color,
    Rating,
    Wishlist,
    Cartuser,
    sequelize,
    ProductSize,
    UserContact,
    ProductData,
    OrderProduct,
    Order,
    ProductPicture,
    ProductCategoryes,
    ProductSizeContact,
    ProductCategoryesContact,
}
