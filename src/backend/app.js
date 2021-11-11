var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var cors = require("cors");
var app = express();
var demoRouter = require("./routes/demo");
const { Client } = require("pg");

NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(express.json());
app.use(express.urlencoded());
app.use(cors({ credentials: true, origin: process.env.REACT_APP_APP_ROOT }));
app.use("/api/demo", demoRouter);
app.use(logger("dev"));

const conString =
  "postgres://cklvedcewjnpka:1473103b4bf9f4ba91480686a557c2d7558befe71d898105d18e78a53d22c878@ec2-18-210-233-138.compute-1.amazonaws.com:5432/d5c871qibdlseo";

const client = new Client({
  user: "cklvedcewjnpka",
  host: "ec2-18-210-233-138.compute-1.amazonaws.com",
  database: "d5c871qibdlseo",
  password: "1473103b4bf9f4ba91480686a557c2d7558befe71d898105d18e78a53d22c878",
  port: 5432,
  ssl: true,
});

try {
  client.connect();
} catch (error) {
  console.log(error);
}

app.locals.pg_client = client;

if (process.env.NODE_ENV === "production") {
  app.use(express.urlencoded({ extended: false }));
  app.use("/", express.static(path.join(__dirname, "../../build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../build", "index.html"));
  });

  app.use(function (req, res, next) {
    next(createError(404));
  });

  app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.render("error");
  });

  const port = process.env.PORT || 3000;

  var server = app.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
  });
  server.timeout = 15000;
} else {
  app.use(express.static(path.join(__dirname, "public")));

  app.use(function (req, res, next) {
    next(createError(404));
  });

  app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.render("error");
  });
}

module.exports = app;
