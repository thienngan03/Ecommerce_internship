const {Model, DataTypes} = require('sequelize');
const sequelize = require("../configs/dbConfig.js");
const bcrypt = require('bcrypt');

class Account extends Model{} 
Account.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    role: {
        type: DataTypes.ENUM('buyer', 'seller', 'admin'),
        allowNull: false,
        defaultValue: 'buyer'
    },
}, {
    sequelize,
    modelName: 'Account',
    tableName: 'accounts',
    timestamps: false,
    hooks: {
        beforeCreate: async (account) => {
            if (account.password) {
                const salt = await bcrypt.genSaltSync(10);
                account.password = await bcrypt.hash(account.password, salt);
            }
        },        
        beforeUpdate: async (account) => {
            if (account.changed('password')) {
                const salt = await bcrypt.genSaltSync(10);
                account.password = await bcrypt.hash(account.password, salt);
            }
        }
    }
});

module.exports = Account;