const express = require('express');
const { getUsersController, getUserController, addUserController, logoutController, loginController } = require('../controllers/userController');
const router = express.Router();
const { auth } = require('../middleware/auth');
// const { admin } = require('../middleware/admin');
const { check } = require('express-validator');

// Getting all users
router.get('/', getUsersController);

// getting single user
router.get(
    // '/:userId',
    // check('userId', 'User Not Found').isMongoId(),
    '/me',
    auth,
    getUserController
)

// Adding new user
router.post(
    '/',
    [
        check('name', 'Name is required').notEmpty(),
        check('email', 'Email is required').notEmpty(),
        check('email', 'Email must be valid').isEmail(),
        check('password', 'Password is required').notEmpty(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
        check('confirmPassword', 'ConfirmPassword is required').notEmpty(),
        // custom validation
        check('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Confirm password doesn\'t match')
            } else {
                return true
            }
        })
    ],
    addUserController)

// Login user
router.post('/login', loginController)

// Logout user
router.post('/logout', auth, logoutController)

module.exports = router;
