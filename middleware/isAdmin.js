const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const isAdmin = await user.hasRole(1);

    if (!isAdmin) {
      return res.status(403).json({ message: 'Brak uprawnień do tej operacji' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Wystąpił błąd', error });
  }
};
