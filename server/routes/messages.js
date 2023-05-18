const router = require("express").Router();
const dotenv = require("dotenv");
const User = require("../models/User.js");
const Message = require("../models/Message.js");
const jwt = require("jsonwebtoken");
const cors = require("cors");

dotenv.config();
const jwt_secret = process.env.JWT_SECRET;

router.get(
  `/messages/:userId`,
  cors({ origin: "https://me-and-who.vercel.app" }),
  async (req, res) => {
    const { userId } = req.params;
    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, jwt_secret, {}, async (error, userData) => {
        if (error) {
          res.status(401).json(error);
        } else {
          try {
            const messagesFetched = await Message.find({
              sender: { $in: [userId, userData.userId] },
              recipient: { $in: [userId, userData.userId] },
            })
              .sort({ createdAt: 1 })
              .exec();

            res.status(200).json(messagesFetched);
          } catch (error) {
            res
              .status(500)
              .json({ error: "An error occurred while fetching messages." });
          }
        }
      });
    }
  }
);

const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

const handler = (req, res) => {
  const d = new Date();
  res.end(d.toString());
};

module.exports = router;
module.exports = allowCors(handler);
