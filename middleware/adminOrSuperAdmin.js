module.exports.adminOrSuperAdmin = async (req, res, next) => {
    if((req.user.role === 'superAdmin') || (req.user.role === 'admin')) next();
    else return res.status(403).send('You are not allowed to access as you are not an admin or a super admin');
}