import express from "express";

const router = express.Router();

const usersRm = [
  {
    id: 1,
    username: "rocky",
    password: "rocky123",
  },
];

router.get("/", (req, res) => {
  res.render("resp/login");
});

router.get("/get-session", (req, res) => {
  req.session.log = {
    login: "ok",
  };
  res.redirect("dashboard");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = usersRm.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(404).json({
      status: 404,
      message: "Invalid user",
      attempt: true,
    });
  }
  res.status(200).json({
    status: 200,
    message: "Login succesful",
    attempt: true,
  });
});

router.get("/dashboard", (req, res) => {
  const { log } = req.session;

  if (!log) return res.redirect(req.baseUrl + "/");

  res.render("resp/dashboard");
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect(req.baseUrl + "/");
  });
});

export default router;
