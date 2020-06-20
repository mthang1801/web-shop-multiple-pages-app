const User = require("../models/user");
const bcrypt = require("bcryptjs");
const config = require("config");
const { validationResult } = require("express-validator");
const request = require("request");
const sendEmail = require("../config/email");
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
    request(
      {
        method: "POST",
        url: "https://api.sendgrid.com/v3/mail/send",
        header:
          "authorization: Bearer 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",
        header: "Content-Type : application/json",
        data: `{"personalizations":[{"to":[{"email":"${to}","name":"${to}"}],"subject":"Hello, World!"}],"content": [{"type": "text/plain", "value": "Heya!"}],"from":{"email":"mthang1801@gmail.com","name":"MVT"},"reply_to":{"email":"mthang1801@gmail.com","name":"MVT"}}`,
      },
      (err, res, body) => {
        if (err) console.log(err);
        console.log(res, body);
      }
    );
    req.flash("sign-up-success", "Create acccount successfully!");
    return res.redirect("/auth/signup");
  } catch (error) {
    req.flash("sign-up-errors", error.message);
    res.status(500).redirect("/auth/signup");
  }
};

exports.postSignOut = (req, res, next) => {
  req.logout();
  req.session.destroy((sess_id, err) => {
    if (err) {
      console.log(err);
    }
  });
  res.redirect("/auth/signin");
};
