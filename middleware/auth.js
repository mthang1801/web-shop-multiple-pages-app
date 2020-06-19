exports.isLogin = (req, res, next) => {
  if (!req.session.isAuthenticated) {
    return res.redirect("/auth/signin");
  }
  next();
};

exports.isLogout = (req, res, next) => {
  if (req.session.isAuthenticated) {
    return res.redirect("/");
  }
  next();
};
