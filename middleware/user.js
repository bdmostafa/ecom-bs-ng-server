const User = require('../models/users');

module.exports.user = async (req, res, next) => {
    if(!(req.user.role === 'user')) return res.status(403).send('You are not allowed to access');
    next();
}