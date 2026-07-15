import express from "express";

const router = express.Router();

const usersBfla = [
  {
    id: 1,
    username: "rocky",
    password: "rocky123",
  },
  {
    id: 2,
    username: "admin",
    password: "admin123",
  },
];
const recipes = [
  {
    id: 1,
    name: "Nasgor",
    description: "1kg nasi, 2kg ayam, 8 butir telur",
  },
  {
    id: 2,
    name: "Mie goreng",
    description: "1kg mie, 2kg ayam, 8 butir telur",
  },
  {
    id: 3,
    name: "Bubur ayam",
    description: "1kg ikan, 2kg ayam, 8 butir telur",
  },
];

const mustBeUser = (req, res, next) => {
  const user = req.session.orang;
  if (!user) return res.redirect(req.baseUrl + "/");
  next();
};

const mustBeChef = (req, res, next) => {
  const user = req.session.orang;
  if (user.role !== "admin") return res.render("bfla/unauthorize");
  next();
};

router.get("/", (req, res) => {
  res.render("bfla/login");
});

router.post("/login", (req, res) => {
  const { username, password, role } = req.body;
  const user = usersBfla.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.redirect(req.baseUrl + "/");
  }
  req.session.orang = {
    id: user.id,
    username: user.username,
    password: user.password,
    role: role,
  };
  res.json({
    status: 200,
    message: "success",
  });
});

router.get("/dashboard", mustBeUser, (req, res) => {
  res.render("bfla/dashboard", {
    recipes,
  });
});
router.get("/create-recipe", mustBeUser, mustBeChef, (req, res) => {
  res.render("bfla/create-recipe");
});

router.post("/create-recipe", mustBeUser, (req, res) => {
  const { name, description } = req.body;
  const newRecipe = {
    id: recipes.length + 1,
    name,
    description,
  };

  recipes.push(newRecipe);
  res.json({
    status: 201,
    message: "New recipe added",
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect(req.baseUrl + "/");
  });
});

export default router;
