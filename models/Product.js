// import important parts of sequelize library
const { Model, DataTypes } = require('sequelize');
// import our database connection from config.js
const sequelize = require('../config/connection');

// Initialize Product model (table) by extending off Sequelize's Model class
class Product extends Model {}

// set up fields and rules for Product model
Product.init(
  {
    //-- first column: id --//
    id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
   },
   //-- second column: product_name --//
   product_name: {
    type: DataTypes.STRING,
    allowNull: false
   },
   //-- third column: price --//
   price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    isDecimal: true
  },
   //-- fourth column: stock --//
   stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
    isNumeric: true
  },
   //-- fifth column: category_id --//
   category_id: {
    type: DataTypes.INTEGER,
    // allowNull: false,
    references: {
      model: 'category',
      key: 'id'
    }
   }

  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product',
  }
);

module.exports = Product;
