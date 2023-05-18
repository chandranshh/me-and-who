const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      max: 20,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
