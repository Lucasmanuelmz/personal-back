const {DataTypes, sequelize} = require('../database/database');
const Author = require('./authorModel');
const Category = require('./categoryModel')

const Article = sequelize.define(
  'article', {

  title: {
   type: DataTypes.STRING,
   allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  slug: {
   type: DataTypes.STRING,
   allowNull: false
  }
  ,
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  article: {
   type: DataTypes.TEXT,
   allowNull: false
  } 
}
)

Article.belongsTo(Category);
Category.hasMany(Article);

Article.belongsTo(Author);
Author.hasMany(Article)

module.exports = Article;