const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrdersSchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            required: true
        },
        customerId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        productName: {
            type: String,
            required: [true, 'Product Name is required'],
        },
        orderQty: {
            type: Number,
            required: [true, 'Order quantity is required'],
        },
        unitPrice: {
            type: Float,
            required: [true, 'Price is required'],
        },
        totalPrice: {
            type: Float,
            required: [true, 'Total price is required'],
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