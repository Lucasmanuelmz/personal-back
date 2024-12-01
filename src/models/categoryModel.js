const {DataTypes, sequelize} = require('../database/database');

const Category = sequelize.define(
  'category',
  {
    name: {
       type: DataTypes.STRING,
       allowNull: false
    },
    slug: {
    type: DataTypes.STRING,
    allowNull: false
   }  
  }
)

Category.sync()
module.exports = Category;