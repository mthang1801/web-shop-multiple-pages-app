const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const { check, body } = require("express-validator");
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

router.get("/signin", authController.getSignIn);

router.get("/signup", authController.getSignUp);

module.exports = router;
