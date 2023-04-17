const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const bookRoutes = require('./routes/bookRoutes');
const sequelize = require('./util/database');
const Role = require('./models/role');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/book', bookRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});

const createRolesIfNeeded = async () => {
    try {
        const adminRole = await Role.findOrCreate({ where: { name: 'Admin' } });
        const userRole = await Role.findOrCreate({ where: { name: 'User' } });
        console.log('Roles ensured:', adminRole[0].name, userRole[0].name);
    } catch (error) {
        console.error('Error creating roles:', error);
    }
};

sequelize.sync()
    .then(result => {
        createRolesIfNeeded();
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(err => {
        console.log(err);
    });
