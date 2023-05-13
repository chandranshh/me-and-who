const router = require("express").Router();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

dotenv.config();

const mongo_url = process.env.MONGO_URL;
const jwt_secret = process.env.JWT_SECRET;
mongoose.connect(mongo_url);

//register
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const createdUser = await User.create({ email, username, password });

    //creating and signing a jwt token
    jwt.sign(
      {
        userId: createdUser._id,
      },
      jwt_secret,
      {},
      (error, token) => {
        if (error) throw error;
        res.cookie("token", token).status(201).json("Token created!"); //res.cookie('cookieName', valueOfCookie);
      }
    );
  } catch (error) {
    res.status(401).json(error);
  }
});

module.exports = router;
