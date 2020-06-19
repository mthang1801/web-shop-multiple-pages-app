const Product = require("../models/product");
const { validationResult } = require("express-validator/check");
const monngose = require("mongoose");
exports.postAddProduct = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Invalid input product.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const { name, subname, price, describe } = req.body;
    let product = new Product({
      name,
      subname,
      price,
      describe,
      user: monngose.Types.ObjectId("5ee26c4a9587d43582138779"),
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

exports.getAddProduct = (req, res, next) => {
  return res.render("products/product-actions", {
    pageTitle: "Add Product",
    path: "/products/add-product",
  });
};
