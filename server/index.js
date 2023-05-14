const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
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
