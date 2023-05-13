const router = require("express").Router();
const dotenv = require("dotenv");
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

dotenv.config();

const jwt_secret = process.env.JWT_SECRET;

//register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const createdUser = await User.create({ username, password });

    //creating and signing a jwt token
    jwt.sign(
      {
        userId: createdUser._id,
        username: createdUser.username,
      },
      jwt_secret,
      {},
      (error, token) => {
        if (error) throw error;
        res.cookie("token", token).status(201).json({
          _id: createdUser._id,
          username: createdUser.username,
        }); //res.cookie('cookieName', valueOfCookie);
      }
    );
  } catch (error) {
    res.status(401).json(error);
  }
});

//profile
router.get("/profile", async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, jwt_secret, {}, (error, userData) => {
        if (error) throw error;
        res.json(userData);
      });
    } else {
      res.status(401).json("No token found!");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
