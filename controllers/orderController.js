// Dependencies
const { validationResult } = require("express-validator");
const _ = require("lodash");
const endOfDay = require('date-fns/endOfDay')
const startOfDay = require('date-fns/startOfDay')

//Models
const Order = require("../models/orders");

module.exports.orderPaymentController = async (req, res) => {
    const resMsg = {
        success: {
            title: 'Payment Status',
            message: 'Your payment has been received successfully'
        }
    }
    setTimeout(() => {
        return res.status(200).json(resMsg);
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

        const newOrder = new Order({productOrdered: pickedProperty, customer:  req.user._id})
        await newOrder.save();

        return res.status(200).send({
            order: newOrder,
            success: {
                title: 'Order Status',
                message: 'Your order has been placed successfully'
            }
        });

    } catch (err) {
        console.error(err)
        return res.status(500).send(err);
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

        // When orders are empty
        const resEmptyMsg = {
            orders: [],
            success: {
              title: 'All Orders',
              message: 'Oops... There is no order right now.'
            }
        }

        if (orders.length === 0) return res.status(200).send(resEmptyMsg);

        const resData = {
            orders,
            success: {
              title: 'All Orders',
              message: `The the orders have been loaded successfully.`
          }
        }

        return res.status(200).send(resData);

    } catch (err) {
        return res.status(500).send(err.message);;
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

        // When orders are empty
        const emptyMsg = {
            success: {
                title: 'User Orders',
                message: `The order of the user ${req?.user?.name} is empty now.`
            }
        }

        if (orders.length === 0) return res.status(200).send(emptyMsg);
        
        const resData = {
            orders,
            success: {
              title: 'User Orders',
              message: `The orders of the user ${req?.user?.name} have been loaded successfully.`
          }
        }

        return res.status(200).send(resData);

    } catch (err) {
        return res.status(500).send(err);;
    }
};

module.exports.getPendingOrdersController = async (req, res) => {
    try {
        const pendingOrders = await Order.find({ 
            status: "Pending"
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
        const resEmptyMsg = {
            orders: [],
            success: {
              title: 'Pending Orders',
              message: 'Oops... Pending orders are empty now.'
            }
        }
       
        if(pendingOrders.length === 0) return res.status(200).send(resEmptyMsg);

        const resData = {
            orders: pendingOrders,
            success: {
              title: 'Pending Orders',
              message: `The pending orders have been loaded successfully.`
          }
        }

        return res.status(200).send(resData);

    } catch (err) {
        return res.status(500).send(err);
    }
};

module.exports.getOrderController = async (req, res) => {
    const id = req.params.orderId;

    // Firstly check on validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send(errors.array());

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

        const resData = {
            order,
            success: {
              title: 'Order By Id',
              message: `The order ${order._id} has been loaded successfully.`
          }
        }

        return res.status(200).send(resData);

    } catch (err) {
        // console.error(err)
        return res.status(500).send(err);
    }
};

module.exports.getOrdersByDateController = async (req, res) => {
    const date = req.params.date;
    // Check on validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send(errors.array());

    // Pick only date field by lodash module
    // const { date } = _.pick(req.body, ["date"]);

    // Getting all orders per day
    try {
        const ordersPerDay = await Order.find({
            // Using date-fns npm, whole day range of a specific date 
            date: {
                $gte: startOfDay(new Date(date)),
                $lte: endOfDay(new Date(date))
              }
            })
            .populate(
                'customer',
                '_id name email'
            )
            .populate(
                'productOrdered productOrdered.product',
                '_id title price description image category'
            );

        const resEmptyMsg = {
            orders: [],
            success: {
                title: 'Orders By Date',
                message: `Oops...! Order not found. Orders of ${date} is empty now.`
            }
        }
            
        if (ordersPerDay.length === 0) {
            return res.status(200).send(resEmptyMsg);
        }

        const resData = {
            orders: ordersPerDay,
            success: {
              title: 'Orders By date',
              message: `The orders of ${date} has been loaded successfully.`
          }
        }

        return res.status(200).send(resData);

    } catch (err) {
        return res.status(500).send(err);
    }
};

module.exports.updateOrderController = async (req, res) => {
    const id = req.params.orderId;
    const orderInputValue = req.body;
console.log("orderId", id, orderInputValue)
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

        const resData = {
            order,
            success: {
              title: 'Order Update',
              message: `The status of the order ${order._id} has been updated successfully.`
          }
        }

        return res.status(200).send(resData);

    } catch (err) {
        return res.status(500).send(err);;
    }
};