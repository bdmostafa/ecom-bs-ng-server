const express = require('express');
const { getUsersController, getUserController, addUserController, logoutController, loginController } = require('../controllers/userController');
const router = express.Router();

// Getting all users
router.get('/', getUsersController);

// getting single user
router.get(
    // '/:userId',
    // check('userId', 'User Not Found').isMongoId(),
    '/me',
    getUserController
)

// Adding new user
router.post('/', addUserController)

// Login user
router.post('/login', loginController)

// Logout user
router.post('/logout', logoutController)

module.exports = router;
