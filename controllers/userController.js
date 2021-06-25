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
    "role",
    "password",
    "confirmPassword"
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
    const { _id, name, email, role } = user;

    return res.status(200).send({
      _id,
      name,
      email,
      role,
      success: {
        title: 'Create User Status',
        message: `The user ${name} has been created successfully.`
      }
    });

  } catch (err) {
    console.log(err)
    return res.status(500).send(err);
  }
};

module.exports.getUserController = async (req, res) => {
  const id = req.user._id;

  try {
    // Password is not allowed to pass to client section (-password)
    const user = await User.findById(id, "-password");
    if (!user) return res.status(404).send("User Not Exists");

    const resData = {
      user,
      success: {
        title: 'User Info Status',
        message: `The user ${user.name}'s info is loaded successfully.`
      }
    }

    return res.status(200).send(resData);

  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports.getUsersController = async (req, res) => {
  try {
    // Password is not allowed to pass to client section
    const users = await User.find({}, "-password");

    const resData = {
      users,
      success: {
        title: 'All Users',
        message: 'All the users info are loaded successfully.'
      }
    }

    return res.status(200).send(resData);

  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports.updateUserController = async (req, res) => {
  const id = req.user._id;
  const userInputValue = req.body;

  // validation update operation and inputData
  const keysInput = Object.keys(userInputValue);
  const allowedForUpdates = ["name", "email", "password", "confirmPassword"];

  // Check if any extra invalid field out of allowedForUpdates is requested or not
  const isAllowed = keysInput.every((update) =>
    allowedForUpdates.includes(update)
  );
  if (!isAllowed) return res.status(400).send("Invalid Update Operation.");

  // Dealing with errors on express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(404).send(errors.array());

  // After passing all errors and validations, executes try/catch
  // Update user from server
  try {
    const user = await User.findOneAndUpdate(
      {
        _id: id
      },
      userInputValue,
      {
        // For adding new user to be updated
        new: true,
        // upsert: true,
        // Active validating rules from Schema model when updating
        runValidators: true,
        context: 'query'
      }
    );

    if (!user) return res.status(404).send("User Not Found");

    // Sending only 3 fields (without password) to the client
    const { name, email, role } = user;
    return res.status(200).send({
      name,
      email,
      role,
      success: {
        title: 'Update Status',
        message: 'You have updated info successfully'
      }
    });

    // res.send(user);
  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports.updateUserBySuperAdminController = async (req, res) => {
  const _id = req.params.userId;
  const userInputValue = req.body;

  // validation update operation and inputData
  const keysInput = Object.keys(userInputValue);
  const allowedForUpdates = ["name", "email", "password", "confirmPassword", "role"];

  // Check if any extra invalid field out of allowedForUpdates is requested or not
  const isAllowed = keysInput.every((update) =>
    allowedForUpdates.includes(update)
  );
  if (!isAllowed) return res.status(400).send("Invalid Update Operation.");

  // Dealing with errors on express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(404).send(errors.array());

  // After passing all errors and validations, executes try/catch
  // Update user from server
  try {
    const user = await User.findOneAndUpdate(
      {
        _id
      },
      userInputValue,
      {
        // For adding new user to be updated
        new: true,
        // upsert: true,
        // Active validating rules from Schema model when updating
        runValidators: true,
        context: 'query'
      }
    );

    if (!user) return res.status(404).send("User Not Found");

    const userData = {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      success: {
        title: 'User Info Update',
        message: `You have updated the user ${user.name}'s info successfully.`
      }
    };

    return res.status(200).send(userData);

    // res.send(user);
  } catch (err) {
    return res.status(500).send(err);
  }
};

module.exports.deleteUserController = async (req, res, next) => {
  const id = req.user?._id;
  if(!id) return res.status(404).send("User ID Not Found");

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send(errors.array());

  // Delete user from server
  try {
    const user = await User.findOneAndDelete({
      _id: id,
    });

    if (!user) return res.status(404).send("User Not Found");

    const resData = {
      user,
      success: {
        title: 'Delete User',
        message: `The user ${user.name} has been deleted successfully.`
      }
    }

    return res.status(200).send(resData);

  } catch (err) {
    return res.status(500).send(err);;
  }
};

module.exports.deleteUserBySuperAdminController = async (req, res, next) => {
  const loggedInUserId = req.user?._id;
  const userIdToBeDeleted = req.params.userId;
  if(!loggedInUserId) return res.status(404).send("LoggedIn User ID Not Found");

  // const userInputValue = req.body;

  // validation update operation and inputData
  // const keysInput = Object.keys(userInputValue);
  // const allowedForUpdates = ["userId"];

  // Check if any extra invalid field out of allowedForUpdates is requested or not
  // const isAllowed = keysInput.every((update) =>
  //   allowedForUpdates.includes(update)
  // );
  // if (!isAllowed) return res.status(400).send("Invalid Update Operation.");
  // const userIdToDelete = userInputValue.userId

  // Pick only valid field
  // const { userId } = _.pick(req.body, ["userId"])

  // Dealing with errors on express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send(errors.array());
// console.log(_.pick(req.body, ["userId"]))
  // Delete user from server
  try {
    // const user = await User.findOneAndDelete({
    //   _id: userIdToDelete,
    // });
    const user = await User.findByIdAndDelete(userIdToBeDeleted);

    if (!user) return res.status(404).send("User Not Found");

    const resData = {
      user,
      success: {
        title: 'Delete User',
        message: `You have deleted the user ${user.name} successfully.`
      }
    }

    return res.status(200).send(resData);

  } catch (err) {
    return res.status(500).send(err);;
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
      httpOnly: false,
      secure: false,
      // sameSite: true,
      signed: true,
      maxAge: 4 * 60 * 60 * 1000,
    });

    // Successfully LoggedIn and send user without password
    const userData = {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      success: {
        title: 'Login Status',
        message: 'You have loggedIn successfully'
      }
    };

    return res.status(200).send(userData);

  } catch (err) {
    console.log(err)
    return res.status(500).send(err);
  }
};

module.exports.logoutController = async (req, res) => {
  const loggedInUserId = req.user?._id;

  try {
    const user = await User.findById(loggedInUserId);
    if (!user) return res.status(404).send("User Not Exists");

    res.clearCookie("auth");

    const resData = {
      success: {
        title: 'Logout Status',
        message: 'You have logged out successfully'
    }
  }

    return res.status(200).send(resData);

  } catch (err) {
    console.log(err)
    return res.status(500).send(err);
  }
  
};