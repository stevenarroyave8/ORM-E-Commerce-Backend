// Import the Sequelize library and its DataTypes module
const { Model, DataTypes } = require('sequelize');

// Import the sequelize instance from the connection.js file
const sequelize = require('../config/connection.js');

// Define a new Category model by extending the Sequelize Model class
class Category extends Model {}

// Define the Category model's columns and their data types
Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  // Define some options for the Category model
  {
    sequelize,
    timestamps: false,
    freezeTableName: true, 
    underscored: true, 
    modelName: 'category', 
  }
);

module.exports = Category;