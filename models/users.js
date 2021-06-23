const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const UsersSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [4, "Name must be 4 chars at least"],
    },
    email: {
      type: String,
      unique: [true, "email must be unique"],
      required: [true, "Email is required"],
      trim: true,
      validate: {
        validator(value) {
          return validator.isEmail(value);
        },
        message: "Must be a valid email.",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      validate: {
        validator(value) {
          return !value.toLowerCase().includes("password");
        },
        message: "Password must not contain 'password'",
      },
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
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
  try {
    // When password is hashed already, no need to be hashed
    if (!this.isModified("password")) {
      return next();
    }

    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
  } catch (err) {
    return next(err);
  }
});

// Hashing data before updating into database
UsersSchema.pre("findOneAndUpdate", async function (next) {
  try {
    if (this._update.password) {
      const hashed = await bcrypt.hash(this._update.password, 10);
      this._update.password = hashed;
    }
    next();
  } catch (err) {
    return next(err);
  }
});

const User = mongoose.model("User", UsersSchema);

module.exports = User;
