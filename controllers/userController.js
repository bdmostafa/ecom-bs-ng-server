// Dependencies

// Models
const User = require("../models/users");

module.exports.addUserController = async (req, res) => {
  
    try {
  
    } catch (err) {
      res.status(500).send(err);
    }
  
  };
  
  module.exports.getUserController = async (req, res) => {
    // const id = req.params.userId;
    const id = req.user._id;
  
    try {

    } catch (err) {
      res.status(500).send(err);
    }
  };
  
  module.exports.getUsersController = async (req, res) => {
    try {
      
    } catch (err) {
      res.status(500).send(err);
    }
  };
  
  module.exports.loginController = async (req, res) => {
    const { email, password } = req.body;
  
    try {
  
      // Successfully LoggedIn
      res.send("LoggedIn Successfully!");
    } catch (err) {
      res.status(500).send(err);
    }
  };
  
  module.exports.logoutController = async (req, res) => {
    res.clearCookie("auth");
    res.send("Successfully logout");
  };