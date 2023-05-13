const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemon = require("nodemon");

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

const port = process.env.PORT;
app.listen(`${port}`, (req, res) => {
  console.log(`Backend is running at port: ${port}`);
});
