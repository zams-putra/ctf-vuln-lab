import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";

import * as path from "path";

const app = express();

const conn = mysql.createConnection({
  host: "localhost",
  user: "owner_db",
  password: "myown_myrule",
  database: "dbngawur",
});

app.set("view engine", "ejs");
app.set("views", path.join(import.meta.dirname, "views"));

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const q = `SELECT * FROM users_ssh WHERE username = '${username}' AND password = '${password}'`;
  conn.query(q, (err, result) => {
    if (result.length > 0) {
      return res.redirect("/d4sh222b02srd");
    } else {
      return res.redirect("/");
    }
  });
});

app.get("/d4sh222b02srd", (req, res) => {
  res.render("dashboard");
});

app.listen(5000, () => console.log(`Started on http://localhost:5000`));
