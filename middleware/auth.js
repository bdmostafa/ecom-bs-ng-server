const jwt = require('jsonwebtoken');
const User = require('../models/users');

module.exports.auth = async (req, res, next) => {
    if (req.signedCookies) {
        // Accessing cookies
        const token = req.signedCookies['auth'];
        
        try {
            // Verify token
            // const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

            // Getting User
            const user = await User.findById(decoded.id);

            if(!user) res.status(404).send("Logged in User not found");

            req.user = user;
            next();

        } catch (err) {
            res.status(401).send('Unauthorized Access.')
        }

    } else {
        res.status(401).send('Unauthorized token')
    }
}