import express from "express";

import * as path from "path";

const app = express();

let mc = 0;

const users = [
  {
    id: 1,
    name: "Mr. Nasi Goreng",
    identity_number: "1012005",
    img: "/img/nasgor.jpg",
    city: "Gotham City",
  },
  {
    id: 2,
    name: "Mr. Mie Goreng",
    identity_number: "1012006",
    img: "/img/mie.jpg",
    city: "Pizza City",
  },
  {
    id: 3,
    name: "Mr. Tahu Tek",
    identity_number: "1012006",
    img: "/img/tahu.jpg",
    city: "Mineral Town",
  },
  {
    id: 4,
    name: "Mrs. Strawberry",
    identity_number: "1012007",
    img: "/img/straw.jpg",
    city: "Candy City",
  },
  {
    id: 5,
    name: "FLAG{D0R_K4G3T_G4}",
    identity_number: "1012009",
    img: "/img/flag.jpg",
    city: "Flag City",
  },
];
app.set("view engine", "ejs");
app.set("views", path.join(import.meta.dirname, "views"));
app.use(express.static(path.join(import.meta.dirname, "public")));

app.get("/", (req, res) => {
  const id = users[mc].id;
  const username = users[mc].name;
  const image = users[mc].img;

  res.render("home", {
    id,
    username,
    image,
  });
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  mc = id - 1;

  const { name, img, city, identity_number } = users[mc];

  res.render("profile", {
    name,
    img,
    identity_number,
    city,
  });
});

app.listen(5000, () => console.log("Server Running on http://localhost:5000"));
