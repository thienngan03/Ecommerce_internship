const { Model, DataTypes } = require('sequelize');
const sequelize = require("../configs/dbConfig.js");
const Account = require('./Account.js');

class Seller extends Model {}
Seller.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
  },
    accountId: {
        type: DataTypes.INTEGER,
        references: {
            model: Account,
                key: 'id'
        },
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
            is: /^[0-9]+$/ // Ensure phone number contains only digits
        }
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },    
    avatarUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Seller',
    tableName: 'sellers',
    timestamps: true,
});
module.exports = Seller;


