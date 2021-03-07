const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductsSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Product Name / Title is required'],
            minLength: [4, 'Title must have 4 chars at least']
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
        },
        description: {
            type: String,
            required: false,
            minLength: [10, 'Description must have 10 chars at least'],
            // maxLength: [100, 'Description length have to be 100 chars at maximum']
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            minLength: [3, 'Title must have 3 chars at least']
        },
        image: {
            type: Buffer,
            required: [true, 'Image is required'],
        },

    },
    {
        timestamps: true
    }
);

const Product = mongoose.model('Product', ProductsSchema);

module.exports = Product;