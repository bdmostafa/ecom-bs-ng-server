const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductsSchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            required: true
        },
        productName: {
            type: String,
            required: [true, 'Product Name is required'],
        },
        image: {
            type: Buffer,
            required: [true, 'Image is required'],
        },
        unitPrice: {
            type: Float,
            required: [true, 'Price is required'],
        }
    },
    {
        timeStamp: true
    }
);

const Product = mongoose.model('Product', ProductsSchema);

module.exports = Product;