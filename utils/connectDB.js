const mongoose = require("mongoose");
const config = require("config");

const connectDB = () => {
  mongoose.Promise = require("bluebird");
  return mongoose.connect(config.get("MONGO_URI"), {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
};

module.exports = connectDB;
