// Dependencies
const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');

// Middleware
const { auth } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const { superAdmin } = require('../middleware/superAdmin');
const { adminOrSuperAdmin } = require('../middleware/adminOrSuperAdmin');
const { 
    getOrdersController, 
    getOrderController,
    getPendingOrdersController, 
    getOrdersByDateController,
    createOrderController,
    updateOrderController,
    getUsersOrdersController,
    orderPaymentController
} = require('../controllers/orderController');

// Getting all orders (authorization for only superAdmin)
router.get(
    '/', 
    [
        auth, 
        superAdmin
    ],
    getOrdersController
);

// Getting pending orders (authorization for admin and superAdmin)
router.get(
    '/pending-orders',
    [
        auth,
        adminOrSuperAdmin
    ],
    getPendingOrdersController
)

// Getting orders summary per date (authorization for only super admin)
router.get(
    '/orders-by-date', 
    [
        check(['date']).isISO8601(),
        auth, 
        superAdmin
    ],
    getOrdersByDateController
);
// Payment Gateway
router.post(
    '/payment', 
    // auth, 
    orderPaymentController
);

// Create new order (authentication for user only)
router.post(
    '/create',
    [
        // auth,
        body()
            .isArray()
            .notEmpty(),
        body('*.product', 'Product Id is required.')
            .isMongoId()
            .notEmpty(),
        body('*.quantity', 'Quantity is required.')
            .notEmpty(),
        // check('product', 'Product Id is required.')
        //     .isMongoId()
        //     .notEmpty(),
        // check('quantity', 'Quantity is required.').notEmpty()
    ],
    createOrderController
);

// Getting single order by Id (authorization for admin and superAdmin)
router.get(
    '/:orderId',
    [
        check('orderId', 'Order Not Found. Id is not valid').isMongoId(),
        // auth,
        // adminOrSuperAdmin
    ],
    getOrderController
);

// Getting orders by LoggedInUser (authentication for user)
router.get(
    '/user/my-orders',
    auth,
    getUsersOrdersController
);

// Update order status (authorization for admin only)
router.patch(
    '/update/:orderId',
    [
        auth,
        admin,
        check('orderId', 'Order Not Found. Id is not valid').isMongoId(),
        check('status', 'Status is required.').notEmpty()
    ],
    updateOrderController
);

module.exports = router;
