const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products");
const { body } = require("express-validator");

router.post(
  "/add-product",
  [
    body("name", "Product Name is required").not().isEmpty(),
    body("price", "Product Price must be a number").notEmpty(),
    body(
      "describe",
      "Describe product is very critical, please fill in there."
    ).notEmpty(),
  ],
  productsController.postAddProduct
);

router.get("/add-product", productsController.getAddProduct);

module.exports = router;
