const express = require('express');
const { 
    getOrdersController, 
    getOrderController,
    getPendingOrdersController, 
    getOrdersByDateController,
    createOrderController,
    updateOrderController
} = require('../controllers/orderController');

const router = express.Router();
const { auth } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const { superAdmin } = require('../middleware/superAdmin');
const { adminOrSuperAdmin } = require('../middleware/adminOrSuperAdmin');
const { check } = require('express-validator');

// Getting all orders (authorization for only superAdmin)
router.get(
    '/', 
    [
        auth, 
        superAdmin
    ],
    getOrdersController
);

// getting single order by Id (authorization for admin and superAdmin)
router.get(
    '/:orderId',
    [
        check('orderId', 'Order Not Found. Id is not valid').isMongoId(),
        auth,
        adminOrSuperAdmin
    ],
    getOrderController
);

// getting pending orders (authorization for admin and superAdmin)
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
    getOrdersByDateController);

// Create new order (authentication for user)
router.post(
    '/create',
    [
        auth,
        check('product', 'Product Id is required.')
            .isMongoId()
            .notEmpty(),
        check('quantity', 'Quantity is required.').notEmpty()
    ],
    createOrderController)

// Update order status (authorization for admin and super admin)
router.patch(
    '/update/:orderId',
    [
        auth,
        adminOrSuperAdmin,
        check('orderId', 'Order Not Found. Id is not valid').isMongoId(),
        check('status', 'Status is required.').notEmpty()
    ],
    updateOrderController
);

module.exports = router;
