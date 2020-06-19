const User = require("../models/user");
const bcrypt = require("bcryptjs");
const config = require("config");
const { validationResult } = require("express-validator");

exports.getSignIn = (req, res, next) => {
  let errors = null;
  let errorsList = req.flash("sign-in-errors");
  if (errorsList.length) {
    errors = errorsList.map((error) => error.msg).join(", ");
  }
  res.render("auth/signin", {
    pageTitle: "Sign In",
    path: "/auth/signin",
    error: errors,
  });
};

exports.getSignUp = (req, res, next) => {
  let errors = null;
  let errorsList = req.flash("sign-up-errors");
  if (errorsList.length) {
    errors = errorsList.map((error) => error.msg).join(", ");
  }
  res.render("auth/signup", {
    pageTitle: "Sign Up",
    path: "/auth/signup",
    isLogin: false,
    error: errors,
  });
};

exports.postSignUp = async (req, res, next) => {
  const errors = validationResult(req);
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  try {
    if (!errors.isEmpty()) {
      let error = errors.array();
      req.flash("sign-up-errors", errors.array());
      return res.redirect("/auth/signup");
    }
    let user = await User.findOne({ email });
    if (user) {
      req.flash("sign-up-errors", { msg: "Account has existed!" });
      return res.redirect("/auth/signup");
    }
    const hashPassword = await bcrypt.hash(password, config.get("SALT"));
    user = new User({
      email,
      name,
      password: hashPassword,
    });
    await user.save();
    req.session.userId = user._id.toString();
    req.session.isAuthenticated = true;
    req.flash("sign-up-success", "Create cccount successfully!");
    return res.redirect("/auth/signup");
  } catch (error) {
    req.flash("sign-up-errors", error.message);
    res.status(500).redirect("/auth/signup");
  }
};

exports.postSignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("sign-in-errors", { msg: "Email or password is not correct" });
      return res.status(422).redirect("/auth/signin");
    }
    let user = await User.findOne({ email });
    if (!user) {
      req.flash("sign-in-errors", { msg: "Email or password is not correct" });
      return res.status(422).redirect("/auth/signin");
    }
    let correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      req.flash("sign-in-errors", { msg: "Email or password is not correct" });
      return res.status(422).redirect("/auth/signin");
    }
    req.session.userId = user._id.toString();
    req.session.isAuthenticated = true;
    return res.redirect("/");
  } catch (error) {
    req.flash("sign-in-errors", error.message);
    res.status(500).redirect("/auth/signin");
  }
};

exports.postSignOut = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }

    res.redirect("/");
  });
};
