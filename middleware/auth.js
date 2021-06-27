const jwt = require('jsonwebtoken');
const User = require('../models/users');

module.exports.auth = async (req, res, next) => {
    // console.log("signedCookies==", req.signedCookies)
    // console.log(req.headers.authorization)
    
    if (req.headers.authorization) {
        // Accessing cookies
        // const token = req.signedCookies['auth'];
        const token = req.headers['authorization'].split(' ')[1];
        
        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

            // Getting User
            const user = await User.findById(decoded.id);

            if(!user) res.status(404).send("Logged in User not found");

            req.user = user;
            next();

        } catch (err) {
            res.status(401).send('No token provided or Unauthorized access.');
        }

    } else {
        res.status(401).send('Unauthorized token')
    }
}