const {DataTypes, Sequelize} = require('sequelize');
require('dotenv').config();

 const sequelize = new Sequelize(process.env.DATABASE_URL,
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

module.exports = {
  sequelize, DataTypes
}