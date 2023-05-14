const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const ws = require("ws");
const nodemon = require("nodemon");
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

const port = process.env.PORT;

//web socket handleing
const server = app.listen(port, () => {
  console.log(`Backend is running at port: ${port}`);
});

const wss = new ws.WebSocketServer({ server: server }); //always pass a server object not just the variable

wss.on(`connection`, (connection) => {
  console.log(`connected`);
  connection.send(`Hello`);
});
