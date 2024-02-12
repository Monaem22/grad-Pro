const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const ApiErrors = require("./util/ApiErrors");
// const bodyParser = require ("body-parser");
const db = require("./config/DataBase.js");
const cors = require("cors");
const mountRoutes = require("./routes");
const port = 5555;
const { log } = require("console");
dotenv.config({ path: "config.env" });
db();
const server = express();

//enable ather domain to access your abblication
server.use(cors());
server.options("*", cors());
//middleware
server.use(express.json());
server.use(express.static(path.join(__dirname, "uploads")));
server.use(express.urlencoded({ extends: true }));
//amountroute
mountRoutes(server);


server.all("*", (req, res, next) => {
  next(new ApiErrors(`cant find your route:${req.originalUrl}`, 400));
});

//serverlisting
server.listen(port, () => {
  log(`the server is running in port ${port}`);
});
