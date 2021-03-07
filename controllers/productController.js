// Dependencies
const { validationResult } = require("express-validator");
const axios = require("axios");

//Models
const Product = require("../models/products");

module.exports.addProductController = async (req, res) => {
  // Firstly check on validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send(errors.array());

  // Pick only valid fields
  const pickedProperty = _.pick(req.body, [
    "title",
    "price",
    "description",
    "category",
    "image"
  ]);

  // If valid, then execute to add a new product
  try {
    const newProduct = new Product(pickedProperty);
    await newProduct.save();

    res.send(newProduct);

  } catch (err) {
    res.status(500).send(err);;
  }
};

module.exports.getProductsController = async (req, res) => {
  // Getting all products from server
  try {
    const products = await Product.find();
    res.send(products);
  } catch (err) {
    res.status(500).send(err);;
  }
};

module.exports.generateProductsController = async (req, res) => {
  try {
    // Product generates limit is 10
    const productResponse = await axios.get(process.env.PRODUCT_API);
    if (!productResponse) return res.status(404).send("Product data is not available");

    const products = await Product.insertMany(productResponse.data, "-id");
    res.send(products);

  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.getProductByIdController = async (req, res) => {
  const id = req.params.productId;

  // Check on validationResult
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(404).send("Product Not Found");

  // Getting product by ID from server
  try {
    const product = await Product.findById(id);

    if (!product) return res.status(404).send("Product Not Found");

    res.send(product);

  } catch (err) {
    res.status(500).send(err);;
  }
};

module.exports.deleteProductController = async (req, res) => {
  const id = req.params.productId;
  
  // Check on validationResult
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(404).send("Product Not Found");

  // Delete product from server
  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) return res.status(404).send("Product Not Found");

    res.send(product);

  } catch (err) {
    res.status(500).send(err);;
  }
};

module.exports.updateProductsController = async (req, res) => {
  const id = req.params.productId;
  const productInputValue = req.body;

  // validation update operation and inputData
  const keysInput = Object.keys(productInputValue);
  const allowedForUpdates = ["title", "price", "description", "category", "image"];

  // Check if any extra invalid field out of allowedForUpdates is requested or not
  const isAllowed = keysInput.every((update) =>
    allowedForUpdates.includes(update)
  );
  if (!isAllowed) return res.status(400).send("Invalid Update Operation.");

  // Dealing with errors on express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(404).send(errors.array());

  // After passing all errors and validations, executes try/catch
  // Update product from server
  try {
    const product = await Product.findOneAndUpdate(
      {
        _id: id
      },
      productInputValue,
      {
        new: true,
        runValidators: true,
        context: 'query'
      }
    );
    if (!product) return res.status(404).send("Product Not Found");
    res.send(product);

  } catch (err) {
    res.status(500).send(err);;
  }
};