import express from "express";

const router = express.Router();

let point = 0;
let msg = null;
const flagCollection = ["FLAG{NasgorPassFlag404}"];
const data = [
  {
    username: "nasgor",
    password: "saveyourpasswordmrnasgor",
  },
];
let isLogin = "";

router.get("/", (req, res) => {
  res.render("brute/home", {
    isLogin,
  });
});

router.get("/hidden-flag", (req, res) => {
  res.render("brute/hidden", {
    point,
    msg,
  });
  msg = null;
});

router.post("/flag", (req, res) => {
  const { flag } = req.body;
  const correct = flagCollection.includes(flag);
  if (correct) {
    point++;
    msg = "Correct answer, great⭐ (+1)";
  } else {
    point--;
    msg = "Wrong answer. (-1)";
  }
  res.redirect("hidden-flag");
});

router.get("/my-notes", (req, res) => {
  res.download("public/ingredients.txt", (err) => err);
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const correct = data.find(
    (d) => d.username === username && d.password === password
  );
  if (correct) {
    res.status(200).redirect("hidden-flag");
  }

  isLogin = "Wrong password";
  res.status(404).redirect(req.baseUrl + "/");
});

export default router;
