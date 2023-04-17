const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adminController = require('../controllers/adminController');
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');

router.post(
  '/register',
  [
    body('login').notEmpty().withMessage('Login jest wymagany'),
    body('name').notEmpty().withMessage('Imię jest wymagane'),
    body('password').notEmpty().withMessage('Hasło jest wymagane')
  ],
  adminController.registerAdmin
);

router.post(
  '/login',
  [
    body('login').notEmpty().withMessage('Login jest wymagany'),
    body('password').notEmpty().withMessage('Hasło jest wymagane')
  ],
  adminController.loginAdmin
);

router.post('/books', authMiddleware, bookController.addBook);
router.delete('/books/:bookId', authMiddleware, bookController.deleteBook);
router.put('/books/:bookId', authMiddleware, bookController.editBook);

router.get('/books', authMiddleware, bookController.getAllBooks);
router.get('/books/available', authMiddleware, bookController.getAvailableBooks);

module.exports = router;
