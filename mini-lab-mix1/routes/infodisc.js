import express from "express";

const router = express.Router();

let pointId = 0;
let msgId = null;
const flagCollectionId = ["FLAG{MYFLAG123}"];

router.get("/", (req, res) => {
  res.render("info-disc/home");
});

router.get("/hidden-flag", (req, res) => {
  res.render("info-disc/hidden", {
    pointId,
    msgId,
  });
  msgId = null;
});

router.post("/flag", (req, res) => {
  const { flag } = req.body;
  const correct = flagCollectionId.includes(flag);
  if (correct) {
    pointId++;
    msgId = "Correct answer, great⭐ (+1)";
  } else {
    pointId--;
    msgId = "Wrong answer. (-1)";
  }
  res.redirect("hidden-flag");
});

export default router;
