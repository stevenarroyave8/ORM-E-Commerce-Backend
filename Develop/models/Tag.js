const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection.js');

class Tag extends Model {}

// Define the Tag model's columns and their data types
Tag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    tag_name: {
      type: DataTypes.STRING
    }
  },
  // Define some options for the Tag model
  {
    sequelize, 
    timestamps: false, 
    freezeTableName: true, 
    underscored: true, 
    modelName: 'tag', 
  }
);

module.exports = Tag;