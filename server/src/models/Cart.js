const {Model, DataTypes} = require('sequelize');
const sequelize = require("../configs/dbConfig.js");

class Cart extends Model {}
Cart.init({
    buyerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'buyers',
            key: 'id'
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }

}, {
    sequelize,
    modelName: "Cart",
    tableName: "carts",
    timestamps: true,
});
module.exports = Cart;
