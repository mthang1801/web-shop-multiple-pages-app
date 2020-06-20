exports.isLogin = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/auth/signin");
  }
  next();
};

exports.isLogout = (req, res, next) => {
  if (req.user) {
    return res.redirect("/");
  }
  next();
};
