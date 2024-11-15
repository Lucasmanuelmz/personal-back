const {sequelize, DataTypes} = require('../database/database');
const User = require('./userModel');
const Article = require('./postModel');

const Author = sequelize.define('author', {
  firstname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  }
})

Author.belongsTo(User, {foreignKey: 'userId', as: 'user'});
User.hasOne(Author, {foreignKey: 'userId', as: 'authorProfile'});

Author.hasMany(Article, { foreignKey: 'authorId', as: 'articles' });
Article.belongsTo(Author, { foreignKey: 'authorId', as: 'author' });
Author.sync({alter: true})

module.exports = Author;