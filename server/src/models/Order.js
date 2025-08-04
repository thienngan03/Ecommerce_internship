const {Model, DataTypes} = require('sequelize');
const sequelize = require("../configs/dbConfig.js");

class Order extends Model {}
Order.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, 
        unique: true
    },
    buyerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'buyers',
            key: 'id'
        }
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['bank', 'cash', 'card']]
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending',
        validate: {
            isIn: [['unpaid', 'pending', 'shipped', 'delivered', 'canceled']]
        }
    }
}, {
    sequelize,
    modelName: "Order",
    tableName: "orders",
    timestamps: true,  
});
module.exports = Order;