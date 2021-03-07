const express = require('express');
const { 
    getProductsController, 
    getProductByIdController, 
    addProductController,
    updateProductsController,
    generateProductsController
} = require('../controllers/productController');

const router = express.Router();
const { auth } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const { adminOrSuperAdmin } = require('../middleware/adminOrSuperAdmin');
const { check } = require('express-validator');
const { superAdmin } = require('../middleware/superAdmin');

// Getting all product (user authentication requirement only)
router.get('/', auth, getProductsController);

// Generating products from third party API (authorization for only super admin)
router.get(
    '/generate-products',
    [
        auth,
        superAdmin
    ],
    generateProductsController
);

// getting single product by Id (user authentication requirement only)
router.get(
    '/:productId',
    [
        check('productId', 'Product Not Found. Id is not valid').isMongoId(),
        auth
    ],
    getProductByIdController
)

// Adding new product (authorization for admin and super admin)
router.post(
    '/create',
    [
        auth,
        adminOrSuperAdmin,
        check('title', 'Title is required.').notEmpty(),
        check('price', 'Price is required.').notEmpty(),
        check('description', 'Description is not to be empty.')
            .optional()
            .notEmpty(),
        check('category', 'Category is required.').notEmpty(),
        check('image', 'Image is required.').notEmpty()
    ],
    addProductController)

// Update product data (authorization for admin and super admin)
router.patch(
    '/update/:productId',
    [
        auth,
        adminOrSuperAdmin,
        check('productId', 'Product Not Found. Id is not valid').isMongoId(),
        check('title', 'Title is required.')
            .optional()
            .notEmpty(),
        check('price', 'Price is required.')
            .optional()
            .notEmpty(),
        check('description', 'Description is not to be empty.')
            .optional()
            .notEmpty(),
        check('category', 'Category is required.')
            .optional()
            .notEmpty(),
        check('image', 'Image is required.')
            .optional()
            .notEmpty()
    ],
    updateProductsController
);

module.exports = router;
