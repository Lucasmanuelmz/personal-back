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

/*
  sequelize.authenticate()
  .then(() =>  {
    console.log('Voce se conectou com sucesso!')
  })
  .catch(error => {
    console.log('Erro ao se connectar com o banco de dados')
  })*/

module.exports = {
  sequelize, DataTypes
}