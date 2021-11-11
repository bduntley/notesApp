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
app.use(cors({ credentials: true, origin: process.env.APP_ROOT }));
app.use("/api/demo", demoRouter);
app.use(logger("dev"));

const client = new Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DB,
  password: process.env.PASSWORD,
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
