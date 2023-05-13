const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    username: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      min: 8,
      max: 20,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
