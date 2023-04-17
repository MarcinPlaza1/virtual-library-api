const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const User = require('./user');
const Book = require('./book');

const BookLoan = sequelize.define('bookLoan', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  loanDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  returnDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

BookLoan.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
BookLoan.belongsTo(Book, { constraints: true, onDelete: 'CASCADE' });

module.exports = BookLoan;

