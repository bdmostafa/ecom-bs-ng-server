// Dependencies
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const _ = require("lodash");

// Models
const User = require("../models/users");

module.exports.addUserController = async (req, res) => {
  // Checking the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send(errors.array());

  // Pick only valid fields by lodash module
  const pickedProperty = _.pick(req.body, [
    "name",
    "email",
    "password",
    "confirmPassword",
    "role"
  ]);

  // Collecting the user inputData and creating an object as user
  const user = new User(pickedProperty);

  try {
    // Checking if email already exists or not
    const foundUser = await User.findOne({ email: req.body.email });
    if (foundUser) return res.status(400).send("User email already registered");

    // When only new email is requested, save to database as a new user
    await user.save();

    // Sending only 3 fields (without password) to the client
    const { name, email, role } = user;
    res.send({
      name,
      email,
      role,
    });

  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.getUserController = async (req, res) => {
  // const id = req.params.userId;
  const id = req.user._id;

  try {
    // Password is not allowed to pass to client section (-password)
    const user = await User.findById(id, "-password");
    if (!user) return res.status(404).send("User Not Exists");
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.getUsersController = async (req, res) => {
  try {
    // Password is not allowed to pass to client section
    const users = await User.find({}, "-password");
    console.log(users)
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check User Email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Unable to login. Email not found.");

    // Check User password
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) return res.status(400).send("Unable to login. Password not matched");

    // Generating Auth Token
    const token = user.generateAuthToken();

    // Send token as header
    res.header("x-auth-token", token);

    // Send token as cookie
    res.cookie("auth", token, {
      httpOnly: true,
      sameSite: true,
      signed: true,
      maxAge: 4 * 60 * 60 * 1000,
    });

    // Successfully LoggedIn
    res.send("LoggedIn Successfully!");

  } catch (err) {
    console.log(err)
    res.status(500).send(err);
  }
};

module.exports.logoutController = async (req, res) => {
  res.clearCookie("auth");
  res.send("Successfully logout");
};