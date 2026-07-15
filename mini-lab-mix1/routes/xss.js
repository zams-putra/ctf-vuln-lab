import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

const JWT =
  "1fe09b91973875132a5b4689c035951c112e6d02cd971043b9729c52a91f50f59d5ef1eaa4deaf1c50620e2ea098a97cb4e3a0a5ff4323e740ff42a9dca9c21f212d15ae434b925a3c1e068ad589d1409b142405b257a9b0d1d96f550aa7c10884b7b3bb17ea662917c65cb47dc761b31075a978033b852a30670b4356391d7a";

// middleware

const users = [];
const quotes = [];

const verifyCookie = (req, res, next) => {
  const { nastar_cookie } = req.cookies;
  if (!nastar_cookie) return res.redirect(req.baseUrl + "/");

  jwt.verify(nastar_cookie, JWT, (err, decode) => {
    if (err) return res.redirect(req.baseUrl + "/");
    req.user = decode;
    next();
  });
};

router.get("/", (req, res) => {
  res.render("xss/login");
});

router.get("/register", (req, res) => {
  res.render("xss/register");
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const newPasswd = await bcrypt.hash(password, 10);
  users.push({ username, password: newPasswd });
  res.status(201).redirect(req.baseUrl + "/");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (!user || !bcrypt.compare(password, user.password))
    return res.status(404).redirect(req.baseUrl + "/");

  const token = jwt.sign({ username }, JWT, { expiresIn: "1h" });
  res.cookie("nastar_cookie", token);

  res.status(200).redirect("profile");
});

router.get("/profile", verifyCookie, async (req, res) => {
  res.render("xss/profile", {
    username: req.user.username,
    quotes,
  });
});

router.post("/quotes", verifyCookie, async (req, res) => {
  const { quote } = req.body;
  const { username } = req.user;

  quotes.push({
    author: username,
    quote,
  });
  res.status(201).redirect("profile");
});

export default router;
