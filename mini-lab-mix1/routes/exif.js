import express from "express";

const router = express.Router();

let point = 0;
let msg = null;
const flagCollection = ["FLAG{MyExifFlag}"];

router.get("/", (req, res) => {
  res.render("exif/home");
});

router.get("/blog", (req, res) => {
  res.render("exif/blog");
});

router.get("/pengepel", (req, res) => {
  res.download(`public/img/person.jpeg`, (err) => console.log(err));
});

router.get("/submit-flag", (req, res) => {
  res.render("exif/hidden", {
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
  res.redirect("submit-flag");
});

export default router;
