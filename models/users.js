const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UsersSchema = new Schema(
    {
        _id: {
            type: Schema.Types.ObjectId,
            required: true
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            minlength: [4, 'Name must be 4 chars at least']
        },
        email: {
            type: String,
            unique: [true, 'email must be unique'],
            required: [true, 'Email is required'],
            trim: true
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6
        },
        role: {
            type: String,
            default: 'user'
        }
    },
    {
        timestamp: true
    }
);

const User = mongoose.model('User', UsersSchema);

module.exports = User;