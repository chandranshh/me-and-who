const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const nodemon = require("nodemon");
const ws = require("ws");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const handleRegister = require("./routes/register.js");
const handleLogin = require("./routes/login.js");

//middlewares
const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000", // your frontend domain
    credentials: true, // allow cookies to be sent from frontend to backend
  })
);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(`MongoDB connection error: ${err}`);
  });

//register
app.use("/api/auth", handleRegister);
app.use("/api/auth", handleLogin);

//test
app.get("/test", (req, res) => {
  res.json("test ok");
});

//web socket handling
const port = process.env.PORT;
const jwt_secret = process.env.JWT_SECRET;
const server = app.listen(port, () => {
  console.log(`Backend is running at port: ${port}`);
});

const wss = new ws.WebSocketServer({ server: server }); //always pass a server object not just the variable

wss.on(`connection`, (client, req) => {
  //console.log(req.headers.cookie);

  const cookie = req.headers.cookie;

  if (cookie) {
    //since there might be several cookies we need to first split it by ; as multiple cookies are separated using ;

    const splitCookie = cookie
      .split(";")
      .find((str) => str.startsWith("token="))
      .split("=")[1];
    //this will split token at index 0 and part after = at index 1

    jwt.verify(splitCookie, jwt_secret, {}, (error, userData) => {
      if (error) {
        res.status(401).json(error);
      } else {
        const { userId, username } = userData;

        //setting up userdata of the connected user
        client.userId = userId;
        client.username = username;
        //all connections sits inside websocket 'wss' server
      }
    });
  }

  //wss.clients is an object so we need to convert it to an array and to do that we simply use spread operator to spread each object in an array form

  [...wss.clients].forEach((client) => {
    client.send(
      JSON.stringify(
        [...wss.clients].map((c) => ({
          online: {
            userId: c.userId,
            username: c.username,
          },
        }))
      )
    );
  });
});
