const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const initPassportLocal = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return done(
              null,
              null,
              req.flash("sign-in-errors", { msg: "Email has not existed" })
            );
          }
          const checkPassword = await bcrypt.compare(password, user.password);
          if (!checkPassword) {
            return done(
              null,
              null,
              req.flash("sign-in-errors", {
                msg: "Email or password is not correct!",
              })
            );
          }
          done(null, user);
        } catch (error) {
          done(
            null,
            null,
            req.flash("sign-in-erorrs", { msg: "Error occurs" })
          );
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      if (!user) {
        return done("User not found", null);
      }
      const UserCopy = { ...user };
      delete UserCopy.password;
      done(null, user);
    } catch (error) {
      done(error.message, null);
    }
  });
};

module.exports = initPassportLocal;
