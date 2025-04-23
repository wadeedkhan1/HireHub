const express = require("express");
const cors = require("cors");
const routes = require("./routes");
require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Welcome to Hire Hub!");
});

app.use(errorHandler);

module.exports = app;
