const User = require('../models/users');

module.exports.superAdmin = async (req, res, next) => {
    if(!(req.user.role === 'superAdmin')) return res.status(403).send('You are not allowed to access as a super admin');
    next();
}