const { FORCE } = require("sequelize/lib/index-hints");
const sequelize = require("../configs/dbConfig.js");

const Account = require('./Account.js');
const Buyer = require('./Buyer.js');
const Cart = require('./Cart.js');
const Order = require('./Order.js');
const OrderDetail = require('./OrderDetail.js');
const Seller = require('./Seller.js');
const Product = require('./Product.js');
const Category = require('./Category.js');
const ProductCategory = require('./ProductCategory.js');
const Shop = require('./aShop.js');
const PaymentMethod = require('./PaymentMethods.js');

const models = {
    Account,
    Seller,
    Product,
    Category,
    Shop,
    ProductCategory,
    Buyer,
    Cart,
    Order,
    OrderDetail,
    PaymentMethod
};

// Account 1-1 Seller
Account.hasOne(Seller, { foreignKey: 'accountId', as: 'seller'});
Seller.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });

// Account 1-1 Buyer
Account.hasOne(Buyer, { foreignKey: 'accountId', as: 'buyer' });
Buyer.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });

// Account 1-1 Shop
Account.hasOne(Shop, { foreignKey: 'accountId', as: 'shop' });
Shop.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });

// Account 1-M PaymentMethod
Account.hasMany(PaymentMethod, { foreignKey: 'userId', as: 'paymentMethods' });
PaymentMethod.belongsTo(Account, { foreignKey: 'userId', as: 'account' });

//shop 1-M Category
Shop.hasMany(Category, { foreignKey: 'shopId', as: 'categories' });
Category.belongsTo(Shop, { foreignKey: 'shopId', as: 'shop' });

// Shop 1-M Product
Shop.hasMany(Product, { foreignKey: 'shopId', as: 'products' });
Product.belongsTo(Shop, { foreignKey: 'shopId', as: 'shop' });

// Product N-M Category
Product.belongsToMany(Category, {
     through: ProductCategory, 
     foreignKey: 'productId',
     otherKey: 'categoryId',
     as: 'categories' });
Category.belongsToMany(Product, { 
    through: ProductCategory, 
    foreignKey: 'categoryId', 
    otherKey: 'productId',
    as: 'products' });

// Product N-M Buyer
Product.belongsToMany(Buyer, {
    through: Cart,
    foreignKey: 'productId',
    otherKey: 'buyerId',
    as: 'buyers'
});
Buyer.belongsToMany(Product, {
    through: Cart,
    foreignKey: 'buyerId',
    otherKey: 'productId',
    as: 'products'
});

// Buyer 1-M Order
Buyer.hasMany(Order, { foreignKey: 'buyerId', as: 'orders' });
Order.belongsTo(Buyer, { foreignKey: 'buyerId', as: 'buyer' });

// Order 1-M OrderDetail
Order.hasMany(OrderDetail, { foreignKey: 'orderId', as: 'orderDetails' });
OrderDetail.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Product 1-M OrderDetail
Product.hasMany(OrderDetail, { foreignKey: 'productId', as: 'orderDetails' });
OrderDetail.belongsTo(Product, { foreignKey: 'productId', as: 'product' });


const syncModels = async () => {
    try {
        await sequelize.sync({ force:false});
        console.log('Database & tables created!');
    } catch (error) {
        console.error('Error syncing models:', error);
    }
}
module.exports = { models, syncModels };
