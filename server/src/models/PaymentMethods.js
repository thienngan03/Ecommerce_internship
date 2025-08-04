const { Model, DataTypes } = require('sequelize');
const sequelize = require("../configs/dbConfig.js");
const Account = require('./Account.js');
class PaymentMethod extends Model {}
PaymentMethod.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Account,
            key: 'id'
        }
    },
    methodName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    bankName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 999]
        }
    },
    banhkUserName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 999]
        }
    },
    bankAccountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 999]
        }
    },
    dateExpiration: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
            isDate: true
        },
        defaultValue: null
    },
    status: {
        type: DataTypes.ENUM('inUsed','notUsed', 'inactive'),
        allowNull: false,
        defaultValue: 'notUsed',
        validate: {
            isIn: [['inUsed', 'notUsed', 'inactive']]
        }
    },
}, {
    sequelize,
    modelName: 'PaymentMethod',
    tableName: 'payment_methods',
    timestamps: true,
    underscored: true
});

module.exports = PaymentMethod;