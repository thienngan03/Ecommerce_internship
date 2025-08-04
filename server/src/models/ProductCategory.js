const {Model, DataTypes} = require('sequelize');
const sequelize = require("../configs/dbConfig.js");
const Product = require('./Product.js');
const Category = require('./Category.js');

class ProductCategory extends Model {}

ProductCategory.init({
    productId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Product,
            key: 'id'
        }
    },
    categoryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Category,
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'ProductCategory',
    tableName: 'product_categories',
    timestamps: true,
});

module.exports = ProductCategory;
