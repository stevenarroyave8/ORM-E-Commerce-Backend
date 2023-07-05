// Loads enviroment variables from a .env file
require('dotenv').config();

// Imports the sequilize library 
const Sequelize = require('sequelize');

const sequelize = process.env.JAWSDB_URL
  ? new Sequelize(process.env.JAWSDB_URL)
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
      host: 'localhost',
      dialect: 'mysql',
      port: 8886,
      dialectOptions: {
        decimalNumbers: true,
      },
    });

module.exports = sequelize;
