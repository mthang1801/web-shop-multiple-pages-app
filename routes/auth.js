const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { check, body } = require("express-validator");
const { isLogin, isLogout } = require("../middleware/auth");
const passport = require("passport");
const initPassportLocal = require("../controllers/passport/local");

initPassportLocal();

router.post(
  "/signup",
  [
    check("name", "Name is invalid").not().isEmpty(),
    check("email", "Email is invalid").isEmail().normalizeEmail(),
    check("password", "Password is invalid")
      .isAlphanumeric()
      .isLength({ min: 6 }),
    check("confirmPassword", "Confirm password is not match").custom(
      (value, { req }) => {
        if (value !== req.body.password) {
          return false;
        }
        return true;
      }
    ),
  ],
  authController.postSignUp
);

router.get("/signin", isLogout, authController.getSignIn);

router.get("/signup", isLogout, authController.getSignUp);

router.post("/signout", isLogin, authController.postSignOut);

router.post(
  "/signin",
  isLogout,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/signin",
    failureFlash: true,
  })
);

module.exports = router;
