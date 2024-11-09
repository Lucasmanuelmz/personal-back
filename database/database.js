const {DataTypes, Sequelize} = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.CONNECTING_STRING,
  {
    dialect: 'postgres',
    timezone: '+02:00',
    logging: false,
    pool: {
      max: 10,  
      min: 0,    
      acquire: 30000, 
      idle: 10000 
    }
  }
);
 sequelize.authenticate()
 .then(() => {
  console.log('Connection has been established successfully.');
 })
  
 .catch (error => {
  console.error('Unable to connect to the database:', error);
})

module.exports = {
  sequelize, DataTypes
}