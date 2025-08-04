const {Model, DataTypes} = require('sequelize');
const sequelize = require("../configs/dbConfig.js");
const Shop = require('./aShop.js');

class Product extends Model {}

Product.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    shopId: {
        type: DataTypes.INTEGER,
        references: {
            model: Shop,
            key: 'id'
        },
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    salePrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            isFloat: true,
            min: 0 // Ensure sale price is not negative
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0 // Ensure stock is not negative
        }
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    }, 
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
});

module.exports = Product;


