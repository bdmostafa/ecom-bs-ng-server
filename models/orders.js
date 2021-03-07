const mongoose = require('mongoose');
// const Product = require('./products');
// const User = require('./users');

const Schema = mongoose.Schema;

const OrdersSchema = new Schema(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: [true, 'Order quantity is required'],
        },
        date: {
            type: Date,
            required: [true, 'Order date is required'],
            default: new Date().toLocaleDateString()
        },
        status: {
            type: String,
            required: [true, 'Status is required'],
            default: 'pending'
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model('Order', OrdersSchema);

module.exports = Order;