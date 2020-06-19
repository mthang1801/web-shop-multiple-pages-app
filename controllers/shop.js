const Product = require("../models/product");

exports.getIndex = async (req, res, next) => {
  try {
    let products = await Product.find();
    res.render("shop/index", {
      path: "/",
      pageTitle: "Home",
      products: products,
    });
  } catch (error) {
    next(error);
  }
};
