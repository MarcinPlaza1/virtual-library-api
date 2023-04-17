const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const Role = require('./role');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

User.belongsToMany(Role, { through: 'userRoles' });
Role.belongsToMany(User, { through: 'userRoles' });

module.exports = User;
