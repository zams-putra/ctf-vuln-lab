import express from "express";

const router = express.Router();

let mc = 0;

const usersIdor = [
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

router.get("/", (req, res) => {
  const id = usersIdor[mc].id;
  const username = usersIdor[mc].name;
  const image = usersIdor[mc].img;

  res.render("idor/home", {
    id,
    username,
    image,
  });
});

router.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  mc = id - 1;

  const { name, img, city, identity_number } = usersIdor[mc];

  res.render("idor/profile", {
    name,
    img,
    identity_number,
    city,
  });
});

export default router;
