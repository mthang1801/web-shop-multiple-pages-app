const User = require("../models/user");
const bcrypt = require("bcryptjs");
const config = require("config");
const { validationResult } = require("express-validator");

exports.postSignUp = async (req, res, next) => {
  const errors = validationResult(req);

  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  try {
    if (!errors.isEmpty()) {
      let error = errors.array();
      req.flash("sign-up-errors", errors.array());
      console.log(req.flash(error));
      return res.redirect("/auth/signup");
    }
    console.log(req.body);
    let user = await User.findOne({ email });
    if (user) {
    }
    const hashPassword = await bcrypt.hash(password, config.get("SALT"));
    console.log(hashPassword);
    user = new User({
      email,
      name,
      password: hashPassword,
    });
    await user.save();

    return res.status(201).json({ ...user._doc });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getSignIn = (req, res, next) => {
  let error = null;
  let flashError = req.flash("error");
  if (flashError && flashError.length) {
    error = req.flash("error")[0];
  }
  res.render("auth/signin", {
    pageTitle: "Sign In",
    path: "/auth/signin",
    error: error,
  });
};

exports.getSignUp = (req, res, next) => {
  let errors = null;
  let errorsList = req.flash("sign-up-errors");
  if (errorsList.length) {
    errors = errorsList.map((error) => error.msg);
  }
  console.log(errors);
  res.render("auth/signup", {
    pageTitle: "Sign Up",
    path: "/auth/signup",
    isLogin: false,
    error: errors,
  });
};
