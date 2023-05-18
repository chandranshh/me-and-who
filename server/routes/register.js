const router = require("express").Router();
const dotenv = require("dotenv");
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");

dotenv.config();

const jwt_secret = process.env.JWT_SECRET;
const salt = bcrypt.genSaltSync(10);

//register
router.post(
  "/register",
  cors({ origin: "https://me-and-who.vercel.app" }),
  async (req, res) => {
    try {
      const { username, password } = req.body;

      const hashedPassword = bcrypt.hashSync(password, salt);

      const createdUser = await User.create({
        username: username,
        password: hashedPassword,
      });

      //creating and signing a jwt token
      jwt.sign(
        {
          userId: createdUser._id,
          username: createdUser.username,
        },
        jwt_secret,
        { sameSite: "none", secure: true },
        (error, token) => {
          if (error) throw error;
          res.cookie("token", token).status(201).json({
            _id: createdUser._id,
            username: createdUser.username,
          }); //res.cookie('cookieName', valueOfCookie);
          //console.log(res.cookie("token", token));
        }
      );
    } catch (error) {
      res.status(401).json(error);
    }
  }
);

//profile
router.get(
  "/profile",
  cors({ origin: "https://me-and-who.vercel.app" }),
  async (req, res) => {
    try {
      const token = req.cookies?.token;
      if (token) {
        jwt.verify(token, jwt_secret, {}, (error, userData) => {
          if (error) {
            res.status(401).json("Invalid token!");
          } else {
            res.json(userData);
          }
        });
      } else {
        res.status(401).json("No token found!");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

module.exports = router;
