const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

exports.registerAdmin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try {
        const newAdmin = await User.create({
            login: req.body.login,
            name: req.body.name,
            password: hashedPassword
        });

        await newAdmin.addRole(1);

        res.status(201).json({ message: 'Administrator zarejestrowany pomyślnie' });
    } catch (error) {
        res.status(500).json({ message: 'Rejestracja nie powiodła się', error });
    }
};

exports.loginAdmin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const admin = await User.findOne({ where: { login: req.body.login } });
        if (!admin) {
            return res.status(401).json({ message: 'Nieprawidłowy login lub hasło' });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Nieprawidłowy login lub hasło' });
        }

        const isAdmin = await admin.hasRole(1);
        if (!isAdmin) {
            return res.status(403).json({ message: 'Brak uprawnień do logowania jako administrator' });
        }

        const token = jwt.sign({ userId: admin.id }, 'secret_key', { expiresIn: '1h' });

        res.status(200).json({ message: 'Zalogowano pomyślnie jako administrator', token });
    } catch (error) {
        res.status(500).json({ message: 'Logowanie nie powiodło się', error });
    }
};
