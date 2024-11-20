const {DataTypes, sequelize} = require('../database/database');

const User = sequelize.define(
  'user', 
{
 firstname: {
  type: DataTypes.STRING,
  allowNull: false
 },
 lastname: {
  type: DataTypes.STRING,
  allowNull: false
 },
 email: {
  type: DataTypes.STRING,
  allowNull: false
 },
 telphone: {
  type: DataTypes.STRING,
  allowNull: true
 },
 password: {
  type: DataTypes.STRING,
  allowNull: false
 },
 role: {
  type: DataTypes.ENUM('user', 'author', 'admin'),
  defaultValue: 'user',
  allowNull: false
 }
}
)
User.sync()

module.exports = User;