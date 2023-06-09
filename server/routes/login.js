const router = require("express").Router();
const dotenv = require("dotenv");
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const bcrpyt = require("bcrypt");
const cors = require("cors");

dotenv.config();

const jwt_secret = process.env.JWT_SECRET;

//login api
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({
    username: username,
  });
  if (foundUser) {
    const passOk = bcrpyt.compareSync(password, foundUser.password);
    if (passOk) {
      jwt.sign(
        {
          userId: foundUser._id,
          username: foundUser.username,
        },
        jwt_secret,
        {},
        (error, token) => {
          if (error) throw error;

          //`token` set identifier so set a unique cookie, i.e, here it will make jwt to generate cookie that starts with token=<GENERATED_COOKIE_HERE>

          res.cookie(`token`, token).status(201).json({
            _id: foundUser._id,
            username: foundUser.username,
          });
        }
      );
    } else {
      res.status(404).json({ message: "Password not found!" });
    }
  }
});

module.exports = router;
