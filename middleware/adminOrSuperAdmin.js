module.exports.adminOrSuperAdmin = async (req, res, next) => {
    if(!(req.user.role === 'superAdmin') && !(req.user.role === 'admin')) return res.status(403).send('You are not allowed to access as you are not an admin or a super admin');
    next();
}