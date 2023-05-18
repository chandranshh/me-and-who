const router = require("express").Router();
const dotenv = require("dotenv");
const User = require("../models/User.js");
const Message = require("../models/Message.js");
const jwt = require("jsonwebtoken");

dotenv.config();
const jwt_secret = process.env.JWT_SECRET;

router.get(`/messages/:userId`, async (req, res) => {
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
});

module.exports = router;
