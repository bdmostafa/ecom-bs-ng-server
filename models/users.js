const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const UsersSchema = new Schema(
    {
        // _id: {
        //     type: Schema.Types.ObjectId,
        //     required: true
        // },
        name: {
            type: String,
            required: [true, 'Name is required'],
            minlength: [4, 'Name must be 4 chars at least']
        },
        email: {
            type: String,
            unique: [true, 'email must be unique'],
            required: [true, 'Email is required'],
            trim: true,
            validate: {
                validator(value) {
                    return validator.isEmail(value);
                },
                message: 'Must be a valid email.'
            }
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
            validate: {
                validator(value) {
                  return !value.toLowerCase().includes("password");
                },
                message: "Password must not contain 'password'",
              }
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

// Generating Auth Token
UsersSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
      {
        id: this._id,
        role: this.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "4h" }
    );
    return token;
  };
  
  // Hashing data before saving into database
  UsersSchema.pre("save", async function (next) {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    // When password is hashed already, no need to be hashed
    if (this.isModified("password")) this.password = hashedPassword;
    next();
  });

const User = mongoose.model('User', UsersSchema);

module.exports = User;