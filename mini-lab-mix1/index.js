import express from "express";
import session from "express-session";

import bruteforce from "./routes/bruteforce.js";
import bfla from "./routes/bfla.js";
import idor from "./routes/idor.js";
import resp from "./routes/resp.js";
import infodisc from "./routes/infodisc.js";

import * as path from "path";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(import.meta.dirname, "views"));
app.use(express.static(path.join(import.meta.dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "keyboard-cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.get("/", (req, res) => {
  res.render("home");
});

// bruteforce
app.use("/bruteforce", bruteforce);

// idor
app.use("/idor", idor);

// bfla
app.use("/bfla", bfla);

app.get("/bfla/robots.txt", (req, res) => {
  res.sendFile(
    path.join(import.meta.dirname, "public", "robots1", "robots.txt")
  );
});

// response manip
app.use("/resp", resp);

// information disclosure
app.use("/info-disc", infodisc);

app.get("/info-disc/robots.txt", (req, res) => {
  res.sendFile(
    path.join(import.meta.dirname, "public", "robots2", "robots.txt")
  );
});

app.listen(5000, () => console.log(`run started on http://localhost:5000`));
