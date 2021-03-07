// Dependencies
const { validationResult } = require("express-validator");
const _ = require("lodash");

//Models
const Order = require("../models/orders");

module.exports.createOrderController = async (req, res) => {
    // Firstly check on validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send(errors.array());

    // Pick only valid fields by lodash module
    const pickedProperty = _.pick(req.body, [
        "product",
        "quantity"
    ]);

    // If valid, then execute to add customer (logged in user) then create a new order 
    try {
        // Collecting the order valid inputData and creating an object as order
        const newOrder = new Order({
            ...pickedProperty,
            customer: req.user._id
        });
        if (!newOrder) return res.status(400).send("Invalid Update Operation.");

        await newOrder.save();

        res.send(newOrder);

    } catch (err) {
        res.status(500).send(err);;
    }
};

module.exports.getOrdersController = async (req, res) => {
    // Getting all orders within populating customer and product model
    try {
        const orders = await Order.find()
            .populate(
                'customer',
                '_id name email'
            )
            .populate(
                'product',
                '_id title price category'
            );

        const updatedOrderWithTotalPrice = [];
        orders?.map(order => {
            const orderObj = {
                _id: order._id,
                // date: order.date,
                status: order.status,
                customer: order.customer,
                product: order.product,
                quantity: order.quantity,
                totalPrice: parseInt(order.quantity * order.product.price).toFixed(2),
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
            }
            updatedOrderWithTotalPrice.push(orderObj);
        })

        res.send(updatedOrderWithTotalPrice);
        // res.send(orders);
    } catch (err) {
        res.status(500).send(err);;
    }
};

module.exports.getPendingOrdersController = async (req, res) => {
    console.log('goes here... pending', req)
    // Getting all pending orders from server
    try {
        const pendingOrders = await Order.find({ 
            status: "pending" 
        })
            .populate(
                'customer',
                '_id name email'
            )
            .populate(
                'product',
                '_id title price category'
            );

        // When pending order is empty
        if(pendingOrders.length === 0) res.send("Oops... Pending orders are empty now.");

        res.send(pendingOrders);

    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports.getOrderController = async (req, res) => {
    const id = req.params.orderId;

    // Populating customer and product model and get order data with them
    try {
        const order = await Order.findById(id)
            .populate(
                'customer',
                '_id name email'
            )
            .populate(
                'product',
                '_id title price category'
            );
        if (!order) return res.status(404).send("Order Not Exists");

        const updatedOrderWithTotalPrice = {
            _id: order._id,
            // date: order.date,
            status: order.status,
            customer: order.customer,
            product: order.product,
            quantity: order.quantity,
            totalPrice: Number(parseFloat(order.quantity * order.product.price).toFixed(2)),
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        };

        res.send(updatedOrderWithTotalPrice);
        // res.send(order);

    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports.getOrdersByDateController = async (req, res) => {
    console.log('goes here... by date')
    // Check on validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send(errors.array());

    // Pick only date field by lodash module
    const { date } = _.pick(req.body, ["date"]);

    // Getting all orders per day
    try {
        const ordersPerDay = await Order.find({
            date
        })
            .populate(
                'customer',
                '_id name email'
            )
            .populate(
                'product',
                '_id title price category'
            );

        if (ordersPerDay.length === 0) res.send(`Oops...! Order of ${date} is empty now.`);

        res.send(ordersPerDay);

    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports.updateOrderController = async (req, res) => {
    const id = req.params.productId;
    const orderInputValue = req.body;

    // validation update operation and inputData
    const keysInput = Object.keys(orderInputValue);
    const allowedForUpdates = ["status"];

    // Check if any extra invalid field out of allowedForUpdates is requested or not
    const isAllowed = keysInput.every((update) =>
        allowedForUpdates.includes(update)
    );
    if (!isAllowed) return res.status(400).send("Invalid Update Operation.");

    // Dealing with errors on express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(404).send(errors.array());

    // After passing all errors and validations, executes try/catch
    // Change order status
    try {
        const order = await Order.findByIdAndUpdate(
            id,
            orderInputValue,
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        );

        if (!order) return res.status(404).send("Order Not Found");

        res.send(order);

    } catch (err) {
        res.status(500).send(err);;
    }
};