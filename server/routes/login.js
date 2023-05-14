const express = require(`express`);
const router = require("express").Router();
const dotenv = require("dotenv");
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const bcrpyt = require("bcrypt");
const ws = require("ws");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // your frontend domain
    credentials: true, // allow cookies to be sent from frontend to backend
  })
);

dotenv.config();

const jwt_secret = process.env.JWT_SECRET;
const port = process.env.PORT;

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

app.use("/api/auth", router);

//web socket handling
const server = app.listen(port, () => {
  console.log(`Backend is running at port: ${port}`);
});

const wss = new ws.WebSocketServer({ server: server }); //always pass a server object not just the variable

wss.on(`connection`, (connection, req) => {
  console.log(req.headers);
});
module.exports = router;
