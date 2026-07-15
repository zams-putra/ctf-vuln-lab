import express from "express";

const router = express.Router();

const users = [
  {
    username: "admin",
    password: "admin000",
    cookie_value: 1,
  },
];

const dashboardMiddleware = (req, res, next) => {
  if (!req.cookies.cookie_value) {
    return res.redirect(req.baseUrl + "/");
  }
  next();
};
const flagMiddleware = (req, res, next) => {
  if (req.cookies.cookie_value !== "7") {
    return res.redirect(req.baseUrl + "/");
  }
  next();
};

router.get("/", (req, res) => {
  res.render("cookiemanip/login", {
    error: null,
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    res.cookie("cookie_value", user.cookie_value.toString());
    return res.redirect("dashboard");
  } else {
    return res.render("cookiemanip/login", {
      error: "Invalid User",
    });
  }
});

router.get("/dashboard", dashboardMiddleware, (req, res) => {
  const cookieVal = req.cookies.cookie_value;
  const hiddenLink = cookieVal === "7";
  res.render("cookiemanip/dashboard", { hiddenLink, cookieVal });
});

router.get("/flag", flagMiddleware, (req, res) => {
  res.render("cookiemanip/flag");
});

export default router;
