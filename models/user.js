const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    address: {
      country: String,
      city: String,
      street: String,
    },
    contact: {
      phone: String,
      fax: String,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "user-default.png",
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        required: true,
      },
    ],
    carts: [
      {
        type: Schema.Types.ObjectId,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);
