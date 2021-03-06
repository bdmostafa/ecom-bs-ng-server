module.exports.superAdmin = async (req, res, next) => {
    if(!(req.user.role === 'superAdmin')) return res.status(403).send('You are not allowed to access as you are not a super admin');
    next();
}