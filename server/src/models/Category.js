const {Model, DataTypes} = require('sequelize');
const sequelize = require("../configs/dbConfig.js");

class Category extends Model{}
Category.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    shopId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'sellers',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }

}, {
    sequelize,
    modelName: "Category",
    tableName: "categories",
    timestamps: true
});
module.exports = Category;