// Dependencies
const { validationResult } = require("express-validator");
const axios = require("axios");
const _ = require("lodash");

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
    "image",
    "quantity"
  ]);

  // If valid, then execute to add a new product
  try {
    const newProduct = new Product(pickedProperty);
    await newProduct.save();

  
    const resData = {
      newProduct,
      success: {
        title: 'Product Create',
        message: 'You have created a product successfully.'
    }
  }

  return res.status(200).send(resData);

  } catch (err) {
    return res.status(500).send(err);;
  }
};

module.exports.getProductsController = async (req, res) => {
  // Getting all products from server
  try {
    const products = await Product.find();

    const resData = {
      products,
      success: {
        title: 'All Products',
        message: 'All the products are loaded successfully.'
    }
  }

  return res.status(200).send(resData);

  } catch (err) {
    return res.status(500).send(err);;
  }
};

module.exports.generateProductsController = async (req, res) => {
  try {
    // Product generates limit is 10
    const productResponse = await axios.get(process.env.PRODUCT_API);
    if (!productResponse) return res.status(404).send("Product data is not available");

    const products = await Product.insertMany(productResponse.data, "-id");

    const resData = {
      products,
      success: {
        title: 'Generate Products',
        message: 'Products are generated from third party API successfully.'
    }
  }

  return res.status(200).send(resData);

  } catch (err) {
    return res.status(500).send(err);
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

    const resData = {
      product,
      success: {
        title: 'Product Detail',
        message: `${product.title}'s detail is loaded successfully.`
    }
  }

  return res.status(200).send(resData);

  } catch (err) {
    return res.status(500).send(err);;
  }
};

module.exports.getProductsByCategoryController = async (req, res) => {
  const category = req.params.categoryName;

  // Check on validationResult
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(404).send("Category Name Not Found");

  // Getting product by ID from server
  try {
    const products = await Product.find({category});

    if (!products) return res.status(404).send("Product Not Found");

    const resData = {
      products,
      success: {
        title: `${category} Products`,
        message: `All ${category} Products are loaded successfully.`
    }
  }

  return res.status(200).send(resData);

  } catch (err) {
    return res.status(500).send(err);;
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

    const resData = {
      product,
      success: {
        title: 'Delete Product',
        message: `The product ${product.title} is deleted successfully.`
    }
  }

  return res.status(200).send(resData);

  } catch (err) {
    return res.status(500).send(err);;
  }
};

module.exports.updateProductsController = async (req, res) => {
  const id = req.params.productId;
  const productInputValue = req.body;

  // validation update operation and inputData
  const keysInput = Object.keys(productInputValue);
  const allowedForUpdates = ["title", "price", "description", "category", "image", "quantity"];

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

    const resData = {
      product,
      success: {
        title: 'Update Product',
        message: `The product ${product.title} is updated successfully.`
    }
  }

  return res.status(200).send(resData);

  } catch (err) {
    return res.status(500).send(err);;
  }
};