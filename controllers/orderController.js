// Dependencies
const { validationResult } = require("express-validator");
const _ = require("lodash");

//Models
const Order = require("../models/orders");

module.exports.orderPaymentController = async (req, res) => {
    setTimeout(() => {
        res.status(200).json({success: true});
    }, 3000)
};

module.exports.createOrderController = async (req, res) => {
    // Firstly check on validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send(errors.array());

    // Pick only valid fields by lodash module
    // const pickedProperty = _.pick(req.body, [
    //     "product",
    //     "quantity"
    // ]);
    const pickedProperty = _.map(req.body, _.partialRight(_.pick, ['product', 'quantity']));
console.log(req?.user?._id)
    // If valid, then execute to add customer (logged in user) then create a new order 
    try {
        // After Collecting the order valid inputData, create an array of object as orders
        // const orders = [];
        // await pickedProperty.map(order => {
        //     const newOrder = new Order({
        //         ...order,
        //         // customer: req.user._id
        //         customer: "60438d8351c19b1588988783"
        //     });

        //     if (!newOrder) return res.status(400).send("Invalid Update Operation.");

        //     newOrder.save();
        //     orders.push(newOrder);
        // });  
        // res.send(orders);    

        const newOrder = new Order({productOrdered: pickedProperty, customer: "60438d8351c19b1588988783"})
        await newOrder.save();
        res.send(newOrder);

    } catch (err) {
        console.error(err)
        res.status(500).send(err);
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
                'productOrdered productOrdered.product',
                '_id title price description image category'
            );

        // const updatedOrderWithTotalPrice = [];
        // orders?.map(order => {
        //     const orderObj = {
        //         _id: order._id,
        //         // date: order.date,
        //         status: order.status,
        //         customer: order.customer,
        //         product: order.product,
        //         quantity: order.quantity,
        //         totalPrice: parseFloat(order.quantity * order.product?.price).toFixed(2),
        //         createdAt: order.createdAt,
        //         updatedAt: order.updatedAt
        //     }
        //     updatedOrderWithTotalPrice.push(orderObj);
        // })

        // res.send(updatedOrderWithTotalPrice);
        res.send(orders);
    } catch (err) {
        res.status(500).send(err.message);;
    }
};

module.exports.getUsersOrdersController = async (req, res) => {
    const id = req.user._id;

    // Getting all orders of loggedInUser with populating product model
    try {
        const orders = await Order.find({ 
            customer: id 
        })
            .populate(
                'productOrdered productOrdered.product',
                '_id title price description image category'
            );
           
        // const updatedOrderWithTotalPrice = [];
        // orders?.map(order => {
        //     const orderObj = {
        //         _id: order._id,
        //         // date: order.date,
        //         status: order.status,
        //         customer: order.customer,
        //         product: order.product,
        //         quantity: order.quantity,
        //         totalPrice: parseFloat(order.quantity * order.product?.price).toFixed(2),
        //         createdAt: order.createdAt,
        //         updatedAt: order.updatedAt
        //     }
        //     updatedOrderWithTotalPrice.push(orderObj);
        // })

        // res.send(updatedOrderWithTotalPrice);
        res.send(orders);
    } catch (err) {
        res.status(500).send(err);;
    }
};

module.exports.getPendingOrdersController = async (req, res) => {
    try {
        const pendingOrders = await Order.find({ 
            status: "pending" 
        })
            .populate(
                'customer',
                '_id name email'
            )
            .populate(
                'productOrdered productOrdered.product',
                '_id title price description image category'
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
                'productOrdered productOrdered.product',
                '_id title price description image category'
            )
            
        if (!order) return res.status(404).send("Order Not Exists");

        // const updatedOrderWithTotalPrice = {
        //     _id: order._id,
        //     // date: order.date,
        //     status: order.status,
        //     customer: order.customer,
        //     product: order.product,
        //     quantity: order.quantity,
        //     totalPrice: Number(parseFloat(order.quantity * order.product.price).toFixed(2)),
        //     createdAt: order.createdAt,
        //     updatedAt: order.updatedAt
        // };

        // res.send(updatedOrderWithTotalPrice);
        res.send(order);

    } catch (err) {
        console.error(err)
        res.status(500).send(err);
    }
};

module.exports.getOrdersByDateController = async (req, res) => {
    // console.log('goes here... by date')
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
                'productOrdered productOrdered.product',
                '_id title price description image category'
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
console.log(id, orderInputValue)
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