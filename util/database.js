const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('virtual_library', 'library_user', 'wo9ZD43Ofsy8BrP', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
});

module.exports = sequelize;
