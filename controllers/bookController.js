const Book = require('../models/book');
const BookLoan = require('../models/bookLoan');

exports.addBook = async (req, res) => {
    try {
        const newBook = await Book.create({
            name: req.body.name,
            ISBN: req.body.ISBN,
            author: req.body.author
        });

        res.status(201).json({ message: 'Książka dodana pomyślnie', book: newBook });
    } catch (error) {
        res.status(500).json({ message: 'Dodawanie książki nie powiodło się', error });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.bookId);

        if (!book) {
            return res.status(404).json({ message: 'Książka nie została znaleziona' });
        }

        await book.destroy();

        res.status(200).json({ message: 'Książka usunięta pomyślnie' });
    } catch (error) {
        res.status(500).json({ message: 'Usuwanie książki nie powiodło się', error });
    }
};

exports.editBook = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.bookId);

        if (!book) {
            return res.status(404).json({ message: 'Książka nie została znaleziona' });
        }

        book.name = req.body.name || book.name;
        book.ISBN = req.body.ISBN || book.ISBN;
        book.author = req.body.author || book.author;

        await book.save();

        res.status(200).json({ message: 'Książka zaktualizowana pomyślnie', book });
    } catch (error) {
        res.status(500).json({ message: 'Aktualizacja książki nie powiodła się', error });
    }
};

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.findAll();

        res.status(200).json({ books });
    } catch (error) {
        res.status(500).json({ message: 'Pobieranie książek nie powiodło się', error });
    }
};

exports.getAvailableBooks = async (req, res) => {
    try {
        const allBooks = await Book.findAll();
        const loanedBooks = await BookLoan.findAll({
            where: {
                returnDate: null
            },
            attributes: ['bookId']
        });

        const loanedBookIds = loanedBooks.map(bookLoan => bookLoan.bookId);
        const availableBooks = allBooks.filter(book => !loanedBookIds.includes(book.id));

        res.status(200).json({ availableBooks });
    } catch (error) {
        res.status(500).json({ message: 'Pobieranie dostępnych książek nie powiodło się', error });
    }
};

exports.loanBook = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.bookId);

        if (!book) {
            return res.status(404).json({ message: 'Książka nie została znaleziona' });
        }

        const isLoaned = await BookLoan.findOne({
            where: {
                bookId: book.id,
                returnDate: null
            }
        });

        if (isLoaned) {
            return res.status(400).json({ message: 'Książka jest już wypożyczona' });
        }

        const newBookLoan = await BookLoan.create({
            userId: req.userId,
            bookId: book.id,
            loanDate: new Date()
        });

        res.status(201).json({ message: 'Książka wypożyczona pomyślnie', bookLoan: newBookLoan });
    } catch (error) {
        res.status(500).json({ message: 'Wypożyczanie książki nie powiodło się', error });
    }
};

exports.returnBook = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.bookId);

        if (!book) {
            return res.status(404).json({ message: 'Książka nie została znaleziona' });
        }

        const bookLoan = await BookLoan.findOne({
            where: {
                bookId: book.id,
                userId: req.userId,
                returnDate: null
            }
        });

        if (!bookLoan) {
            return res.status(400).json({ message: 'Książka nie została wypożyczona przez tego użytkownika' });
        }

        bookLoan.returnDate = new Date();
        await bookLoan.save();

        res.status(200).json({ message: 'Książka zwrócona pomyślnie', bookLoan });
    } catch (error) {
        res.status(500).json({ message: 'Zwrot książki nie powiódł się', error });
    }
};
