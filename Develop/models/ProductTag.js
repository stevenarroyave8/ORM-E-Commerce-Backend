const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class ProductTag extends Model {}

// Define the ProductTag model's columns and their data types
ProductTag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'product',
        key: 'id',
        unique: false
      }
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tag',
        key: 'id',
        unique: false
      }
    },
  },
  // Define some options for the ProductTag model
  {
    sequelize, 
    timestamps: false, 
    freezeTableName: true, 
    underscored: true, 
    modelName: 'product_tag', 
  }
);

module.exports = ProductTag;