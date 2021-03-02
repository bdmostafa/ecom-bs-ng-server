const jwt = require('jsonwebtoken');
const User = require('../models/users');

module.exports.admin = async (req, res, next) => {
    if(!(req.user.role === 'admin')) return res.status(403).send('You are not allowed to access');
    next();
}