const express = require("express");
const connectDB = require("./utils/connectDB");
const session = require("express-session");
const app = express();
const config = require("config");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const port = process.env.PORT || 5000;
const path = require("path");
const authRouter = require("./routes/auth");
const shopRouter = require("./routes/shop");
const productsRouter = require("./routes/products");
const passport = require("passport");
const User = require("./models/user");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const store = new MongoStore({
  url: config.get("MONGO_URI"),
  collection: "sessions",
});

//set static views
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/images-url",
  express.static(path.join(__dirname, "assets", "images"))
);
app.use(
  session({
    secret: config.get("SESSION_SECRET"),
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60 * 60 * 1000 },
    store: store,
    unset: "destroy",
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(async (req, res, next) => {
  if (!req.user) {
    return next();
  }
  try {
    let user = await User.findById(req.user, { password: 0 });
    if (!user) {
      return next();
    }

    req.user = user;
    next();
  } catch (error) {
    next();
  }
});

app.use((req, res, next) => {
  console.log(!!req.user);
  res.locals.isAuthenticated = !!req.user;
  next();
});

app.use(shopRouter);
app.use("/products", productsRouter);
app.use("/auth", authRouter);

app.use((error, req, res, next) => {
  console.log("error");
  const message = error.message;
  const data = error.data;
  const status = error.statusCode || 500;
  console.log(error.message);
  res.status(status).json({ message: message, data: data });
});
connectDB()
  .then((res) => {
    console.log("DB connected");
    app.listen(port, console.log(`Server is running on port ${port}`));
  })
  .catch((err) => {
    console.log(err.message);
  });
