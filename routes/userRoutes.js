const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');

router.post(
  '/register',
  [
    body('login').notEmpty().withMessage('Login jest wymagany'),
    body('name').notEmpty().withMessage('Imię jest wymagane'),
    body('password').notEmpty().withMessage('Hasło jest wymagane')
  ],
  userController.register
);

router.post(
  '/login',
  [
    body('login').notEmpty().withMessage('Login jest wymagany'),
    body('password').notEmpty().withMessage('Hasło jest wymagane')
  ],
  userController.login
);

router.get('/books/', authMiddleware, bookController.getAllBooks);
router.get('/books/available', authMiddleware, bookController.getAvailableBooks);
router.post('/books/:bookId/loan', authMiddleware, bookController.loanBook);
router.post('/books/:bookId/return', authMiddleware, bookController.returnBook);

module.exports = router;
