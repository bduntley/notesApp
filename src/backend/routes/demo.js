var express = require("express");
var router = express.Router();

router.get("/", async function (req, res, next) {
  const client = req.app.locals.pg_client;
  client.query('SELECT * FROM "Notes";', [], (err, result) => {
    if (result) {
      res.json(result.rows);
    }
    if (err) {
      console.log(err);
      res.json(err);
    }
  });
});

router.post("/update", async function (req, res, next) {
  const client = req.app.locals.pg_client;
  client.query(
    'UPDATE "Notes" SET content = $1 WHERE id = $2;',
    [req.body.content, req.body.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.json(false);
      } else {
        res.json(true);
      }
    }
  );
});

router.get("/add", async function (req, res, next) {
  const client = req.app.locals.pg_client;
  client.query(
    'INSERT INTO "Notes"(content) VALUES($1) RETURNING id;',
    [""],
    (err, result) => {
      if (result) {
        res.json(result.rows[0].id);
      }
      if (err) {
        console.log(err);
        res.json(err);
      }
    }
  );
});

router.delete("/delete/:id", async function (req, res, next) {
  const client = req.app.locals.pg_client;
  client.query(
    'DELETE FROM "Notes" WHERE id = $1;',
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.json(false);
      } else {
        res.json(true);
      }
    }
  );
});

module.exports = router;
