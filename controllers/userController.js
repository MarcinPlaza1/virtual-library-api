const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try {
        const newUser = await User.create({
            login: req.body.login,
            name: req.body.name,
            password: hashedPassword
        });

        await newUser.addRole(2);

        res.status(201).json({ message: 'Użytkownik zarejestrowany pomyślnie' });
    } catch (error) {
        res.status(500).json({ message: 'Rejestracja nie powiodła się', error });
    }
};

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findOne({ where: { login: req.body.login } });
        if (!user) {
            return res.status(401).json({ message: 'Nieprawidłowy login lub hasło' });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Nieprawidłowy login lub hasło' });
        }

        const token = jwt.sign({ userId: user.id }, 'secret_key', { expiresIn: '1h' });

        res.status(200).json({ message: 'Zalogowano pomyślnie', token });
    } catch (error) {
        res.status(500).json({ message: 'Logowanie nie powiodło się', error });
    }
};
