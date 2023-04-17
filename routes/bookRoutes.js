const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

router.get('/books', authMiddleware, bookController.getAllBooks);
router.get('/books/available', authMiddleware, bookController.getAvailableBooks);

router.post('/books/:bookId/loan', authMiddleware, bookController.loanBook);
router.post('/books/:bookId/return', authMiddleware, bookController.returnBook);

router.post('/admin/books', authMiddleware, isAdmin, bookController.addBook);
router.delete('/admin/books/:bookId', authMiddleware, isAdmin, bookController.deleteBook);
router.put('/admin/books/:bookId', authMiddleware, isAdmin, bookController.editBook);

module.exports = router;
